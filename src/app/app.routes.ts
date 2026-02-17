import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RoomSelection } from './components/room-selection/room-selection';
import { ProductSelection } from './components/product-selection/product-selection';
import { Products } from './pages/products/products';

export const routes: Routes = [
  
  { path: '', component: HomeComponent },
  //{ path: 'styles', component: RoomSelection }, 
  //{ path: 'categories', component: ProductSelection }
  { path: 'products', component: Products }

];


