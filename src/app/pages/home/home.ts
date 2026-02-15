import { Component } from '@angular/core';
// ייבוא של כל חמשת החלקים שיצרנו
import { TopMenu } from '../../components/top-menu/top-menu';
import { RoomSelection } from '../../components/room-selection/room-selection';
import { FurnitureGallery } from '../../components/furniture-gallery/furniture-gallery';
import { ProductSelection } from '../../components/product-selection/product-selection';
import { ContactFooter } from '../../components/contact-footer/contact-footer';
import { Navbar } from "../../components/navbar/navbar";

@Component({
  selector: 'app-home',
  standalone: true,
  // כאן אנחנו מוסיפים אותן לרשימת הייבוא של דף הבית
  imports: [
    TopMenu,
    RoomSelection,
    FurnitureGallery,
    ProductSelection,
    ContactFooter,
    Navbar
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent { }