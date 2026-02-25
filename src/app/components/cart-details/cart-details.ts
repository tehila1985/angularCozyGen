import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-details.html',
  styleUrls: ['./cart-details.css']
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
