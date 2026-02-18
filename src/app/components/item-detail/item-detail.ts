import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.activeImage = this.product.frontImageUrl;
      this.qty = 1;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    const cartData = localStorage.getItem('cart');
    let cart: any[] = cartData ? JSON.parse(cartData) : [];

    const uniqueId = (this.product as any).productId ?? (this.product as any).id;
    if (!uniqueId) {
      console.error('אין ID למוצר!');
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

    const existingProductIndex = cart.findIndex(item => item.productId === uniqueId);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += this.qty;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.qty = 1;
    alert(`המוצר ${this.product.name} נוסף לסל!`);
  }
}
