import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.updateCartCount();
  }

  updateCartCount() {
    const cart = this.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(count);
  }

  getCart(): any[] {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }
}
