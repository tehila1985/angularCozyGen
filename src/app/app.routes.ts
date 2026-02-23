import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Products } from './pages/products/products';
import { Item } from './pages/item/item';
import { Cart } from './pages/cart/cart';
import { ContactComponent } from './pages/contact/contact';
import { AuthComponent } from './pages/auth/auth';
import { CheckoutComponent } from './pages/checkout/checkout';
import { ProfileComponent } from './pages/profile/profile';
import { OrderHistoryComponent } from './pages/order-history/order-history';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: Products },
  { path: 'item', component: Item },
  { path: 'cart', component: Cart },
  { path: 'contact', component: ContactComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'admin', component: AdminComponent }
];


