import { Component } from '@angular/core';
import { TopMenu } from '../../components/top-menu/top-menu';
import { CartDetailsComponent } from '../../components/cart-details/cart-details';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [TopMenu, CartDetailsComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

}
