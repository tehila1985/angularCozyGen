import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Products } from './pages/products/products';
import { Item } from './pages/item/item';
import { Cart } from './pages/cart/cart';
import { ContactComponent } from './pages/contact/contact';
import { AuthComponent } from './pages/auth/auth';
import { CheckoutComponent } from './pages/checkout/checkout';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: Products },
  { path: 'item', component: Item },
  { path: 'cart', component: Cart },
  { path: 'contact', component: ContactComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'checkout', component: CheckoutComponent }
];


