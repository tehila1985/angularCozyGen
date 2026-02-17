import { Component, inject } from '@angular/core';
// ייבוא של כל חמשת החלקים שיצרנו
import { TopMenu } from '../../components/top-menu/top-menu';
import { RoomSelection } from '../../components/room-selection/room-selection';
import { FurnitureGallery } from '../../components/furniture-gallery/furniture-gallery';
import { ProductSelection } from '../../components/product-selection/product-selection';
import { ContactFooter } from '../../components/contact-footer/contact-footer';
import { Navbar } from "../../components/navbar/navbar";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopMenu,
    RoomSelection,
    FurnitureGallery,
    ProductSelection,
    ContactFooter,
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