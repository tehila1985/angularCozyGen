import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TopMenu } from '../../components/top-menu/top-menu';
import { OrderService } from '../../services/order';
import { UserService } from '../../services/user';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';
import { CreateOrderRequest, OrderItem } from '../../models/order.model';
import { forkJoin } from 'rxjs';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, MessageModule, TopMenu],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);

  cart: any[] = [];
  totalAmount = 0;
  errorMessage = '';
  successMessage = '';
  isProcessing = false;
  private renderTimeout: any;
  private navigationTimeout: any;

  ngOnInit() {
    console.log('Checkout ngOnInit called');
    this.loadCart();
    if (this.cart.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    console.log('Loading PayPal script...');
    this.loadPayPalScript();
  }

  ngOnDestroy() {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }

  loadCart() {
    const data = localStorage.getItem('cart');
    this.cart = data ? JSON.parse(data) : [];
    this.totalAmount = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  loadPayPalScript() {
    console.log('loadPayPalScript called, paypal exists:', typeof paypal !== 'undefined');
    if (typeof paypal !== 'undefined') {
      this.renderPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=ILS';
    script.onload = () => {
      console.log('PayPal script loaded');
      this.renderPayPalButton();
    };
    document.body.appendChild(script);
  }

  renderPayPalButton() {
    console.log('renderPayPalButton called');
    const container = document.getElementById('paypal-button-container');
    console.log('Container found:', !!container);
    if (!container) {
      this.renderTimeout = setTimeout(() => this.renderPayPalButton(), 100);
      return;
    }
    
    container.innerHTML = '';
    console.log('Rendering PayPal button...');
    
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalAmount.toFixed(2),
              currency_code: 'ILS'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(() => {
          this.completeOrder();
        });
      },
      onError: (err: any) => {
        this.errorMessage = 'שגיאה בתשלום, נסה שוב';
        console.error('PayPal Error:', err);
      }
    }).render('#paypal-button-container');
  }

  completeOrder() {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth']);
      return;
    }

    this.isProcessing = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const productIds = this.cart.map(item => item.productId);
    const stockChecks = productIds.map(id => this.productService.getProductById(id));

    forkJoin(stockChecks).subscribe({
      next: (products: any[]) => {
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const cartItem = this.cart.find(item => item.productId === product.productId);
          
          if (!cartItem) continue;
          
          if (product.stock === 0) {
            this.errorMessage = `המוצר ${product.name} אזל מהמלאי`;
            this.isProcessing = false;
            return;
          }
          
          if (cartItem.quantity > product.stock) {
            this.errorMessage = `למוצר ${product.name} יש במלאי רק ${product.stock} יחידות`;
            this.isProcessing = false;
            return;
          }
        }
        
        this.processOrder();
      },
      error: (err) => {
        console.error('Stock check error:', err);
        this.errorMessage = 'שגיאה בבדיקת מלאי';
        this.isProcessing = false;
      }
    });
  }

  processOrder() {
    const currentUser = this.userService.getCurrentUser()!;
    const orderItems: OrderItem[] = this.cart.map(item => ({
      orderItemId: 0,
      orderId: 0,
      itemName: item.name || 'מוצר ללא שם',
      productId: item.productId || null,
      quantity: item.quantity,
      priceAtPurchase: item.price
    }));

    const orderRequest: CreateOrderRequest = {
      orderId: 0,
      userId: parseInt(currentUser.userId),
      orderDate: new Date(),
      status: 'Paid',
      totalPrice: this.totalAmount,
      orderItems: orderItems
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.successMessage = `הזמנה מספר ${order.orderId} בוצעה בהצלחה!`;
        localStorage.removeItem('cart');
        this.updateCartService();
        this.navigationTimeout = setTimeout(() => {
          this.isProcessing = false;
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        console.error('Order error:', err);
        this.errorMessage = 'שגיאה בשמירת ההזמנה';
        this.isProcessing = false;
      }
    });
  }

  updateCartService() {
    this.cartService.updateCartCount();
  }

  completeOrderWithoutPayment() {
    this.completeOrder();
  }
}
