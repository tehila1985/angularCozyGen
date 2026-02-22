import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { OrderService } from '../../services/order';
import { UserService } from '../../services/user';
import { CreateOrderRequest, OrderItem } from '../../models/order.model';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, MessageModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);

  cart: any[] = [];
  totalAmount = 0;
  errorMessage = '';
  successMessage = '';
  isProcessing = false;

  ngOnInit() {
    this.loadCart();
    if (this.cart.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.loadPayPalScript();
  }

  loadCart() {
    const data = localStorage.getItem('cart');
    this.cart = data ? JSON.parse(data) : [];
    this.totalAmount = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  loadPayPalScript() {
    if (typeof paypal !== 'undefined') {
      this.renderPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=ILS';
    script.onload = () => this.renderPayPalButton();
    document.body.appendChild(script);
  }

  renderPayPalButton() {
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
    const orderItems: OrderItem[] = this.cart.map(item => ({
      orderItemId: 0,
      orderId: 0,
      itemName: item.name,
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
        setTimeout(() => {
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

  completeOrderWithoutPayment() {
    this.completeOrder();
  }
}
