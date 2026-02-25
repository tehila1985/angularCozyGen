import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { NotificationService } from '../../services/notification';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css',
})
export class ItemDetail implements OnChanges {
  @Input() product: Product | undefined;
  activeImage: string = '';
  qty: number = 1;

  constructor(private notificationService: NotificationService, private cartService: CartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.activeImage = this.product.frontImageUrl;
      this.qty = 1;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.product.stock || this.product.stock <= 0) {
      this.notificationService.show('המוצר אזל מהמלאי', 'error');
      return;
    }

    const cartData = localStorage.getItem('cart');
    let cart: any[] = cartData ? JSON.parse(cartData) : [];

    const uniqueId = (this.product as any).productId ?? (this.product as any).id;
    if (!uniqueId) {
      console.error('אין ID למוצר!');
      return;
    }

    const existingProductIndex = cart.findIndex(item => item.productId === uniqueId);
    const currentCartQty = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;

    if (currentCartQty + this.qty > this.product.stock) {
      if (currentCartQty >= this.product.stock) {
        this.notificationService.show(`כבר יש לך ${currentCartQty} בסל - זה כל המלאי!`, 'error');
      } else {
        const remaining = this.product.stock - currentCartQty;
        this.notificationService.show(`יש לך כבר ${currentCartQty} בסל. אפשר להוסיף עוד ${remaining} בלבד`, 'error');
      }
      return;
    }

    const productToAdd = {
      productId: uniqueId,
      name: this.product.name,
      price: this.product.price,
      image: this.product.frontImageUrl,
      description: this.product.description || '',
      quantity: this.qty
    };

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += this.qty;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartService.updateCartCount();
    this.qty = 1;
    this.notificationService.show(`המוצר ${this.product.name} נוסף לסל!`, 'success');
  }
}
