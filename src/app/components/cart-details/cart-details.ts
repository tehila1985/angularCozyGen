import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="cart-section">
    <div class="header-container">
      <span class="category-label">YOUR SELECTION</span>
      <h3 class="style-heading">סל הקניות</h3>
      <p class="style-subtext">כל המוצרים שבחרת במקום אחד</p>
    </div>
    <div *ngIf="cart.length === 0" class="empty-cart">
      סל הקניות שלך ריק כרגע
    </div>
    <div class="cart-list" *ngIf="cart.length > 0">
      <div *ngFor="let item of cart; let i = index" class="cart-item" [class.appear]="isLoaded" [style.transition-delay]="(i*80)+'ms'">
        <div class="image-wrapper">
          <img [src]="item.image" [alt]="item.name">
        </div>
        <div class="item-info">
          <h4 class="product-title">{{ item.name }}</h4>
          <p class="product-desc">{{ item.description || '' }}</p>
          <div class="item-actions">
            <div class="qty-control">
              <button (click)="decreaseQty(i)">-</button>
              <span>{{ item.quantity }}</span>
              <button (click)="increaseQty(i)">+</button>
            </div>
            <p class="product-price">₪{{ item.price }}</p>
            <button class="remove-btn" (click)="removeItem(i)">הסר</button>
          </div>
        </div>
      </div>
    </div>
    <div class="summary-box" *ngIf="cart.length > 0">
      <div class="total">
        סה״כ לתשלום: <span>₪{{ getTotal() }}</span>
      </div>
      <button class="order-btn" (click)="checkout()">מעבר להזמנה</button>
    </div>
  </section>
  `,
  styles: [`
    .cart-section { min-height: calc(100vh - 100px); padding: 40px 40px 80px; background: #f5f5f5; font-family: 'Noto Sans Hebrew', sans-serif; direction: rtl; }
    .header-container { text-align: center; margin-bottom: 50px; }
    .category-label { font-size: 12px; letter-spacing: 2px; color: #929292; font-weight: 700; display: block; margin-bottom: 16px; text-transform: uppercase; }
    .style-heading { font-size: 48px; font-weight: 700; color: #111; margin: 0; }
    .style-subtext { font-size: 18px; color: #484848; margin-top: 16px; }
    .empty-cart { text-align: center; font-size: 20px; color: #929292; padding: 80px 20px; }
    .cart-list { display: flex; flex-direction: column; gap: 24px; max-width: 1000px; margin: 0 auto; }
    .cart-item { display: flex; background: #fff; padding: 24px; gap: 24px; border-radius: 0; opacity: 0; transform: translateY(20px); transition: all 0.5s ease; }
    .cart-item.appear { opacity: 1; transform: translateY(0); }
    .image-wrapper { flex: 0 0 120px; height: 120px; overflow: hidden; }
    .image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .product-title { font-size: 20px; font-weight: 700; color: #111; margin: 0; }
    .product-desc { font-size: 14px; color: #484848; margin: 8px 0; }
    .item-actions { display: flex; align-items: center; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
    .qty-control { display: flex; align-items: center; gap: 12px; }
    .qty-control button { width: 32px; height: 32px; border: 2px solid #111; background: #fff; cursor: pointer; font-weight: 700; }
    .qty-control button:hover { background: #111; color: #fff; }
    .product-price { font-weight: 700; color: #008B8B; font-size: 20px; margin: 0; }
    .remove-btn { background: none; border: none; color: #929292; cursor: pointer; text-decoration: underline; }
    .remove-btn:hover { color: #111; }
    .summary-box { max-width: 1000px; margin: 40px auto 0; text-align: right; background: #fff; padding: 32px; }
    .total { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
    .total span { color: #008B8B; }
    .order-btn { background: #008B8B; color: white; padding: 16px 48px; border: none; cursor: pointer; font-size: 16px; font-weight: 700; border-radius: 50px; transition: background 0.2s; }
    .order-btn:hover { background: #006666; }
    @media (max-width: 768px) {
      .cart-item { flex-direction: column; align-items: center; text-align: center; }
      .image-wrapper { width: 100%; height: 200px; }
      .item-actions { justify-content: center; }
    }
  `]
})
export class CartDetailsComponent {
  cart: any[] = [];
  isLoaded = false;

  constructor(private router: Router, private userService: UserService, private cartService: CartService) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    const data = localStorage.getItem('cart');
    this.cart = data ? JSON.parse(data) : [];
    setTimeout(() => this.isLoaded = true, 150);
  }

  saveCart() { 
    localStorage.setItem('cart', JSON.stringify(this.cart)); 
    this.cartService.updateCartCount();
  }

  increaseQty(index: number) { this.cart[index].quantity++; this.saveCart(); }

  decreaseQty(index: number) { 
    if(this.cart[index].quantity > 1) {
      this.cart[index].quantity--; 
      this.saveCart();
    }
  }

  removeItem(index: number) { this.cart.splice(index, 1); this.saveCart(); }

  getTotal(): number { return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); }

  checkout() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
