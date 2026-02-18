import { Component, inject } from '@angular/core';
import { TopMenu } from '../../components/top-menu/top-menu';
import { RoomSelection } from '../../components/room-selection/room-selection';
import { ProductSelection } from '../../components/product-selection/product-selection';
import { Navbar } from "../../components/navbar/navbar";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopMenu,
    RoomSelection,
    ProductSelection,
    Navbar,
    RouterOutlet
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
   private router = inject(Router);

onStyleChoose(styleId: number) {
  this.router.navigate(['/products'], {
    queryParams: { styleId }
  });
}

 onCategoryChoose(categoryId: number) {
  this.router.navigate(['/products'], {
    queryParams: { categoryId }
  });
}
}