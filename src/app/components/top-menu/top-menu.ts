import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-top-menu',
  standalone: true, 
  imports: [MenubarModule,RouterModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
})
export class TopMenu implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home',routerLink: '/', fragment: 'home-section' },
      { label: 'Shop by Style', icon: 'pi pi-image',routerLink: '/', fragment: 'styles-section'},
      {
        label: 'Shop by Category',
        routerLink: '/',
        fragment: 'products-section',
        icon: 'pi pi-th-large',
        items: [
          { label: 'Sofas', icon: 'pi pi-heart' },
          { label: 'Sideboards & Display Cabinets', icon: 'pi pi-inbox' },
          { label: 'TV & Media Units', icon: 'pi pi-desktop' },
          { label: 'Coffee & Side Tables', icon: 'pi pi-table' },
          { label: 'Rugs', icon: 'pi pi-clone' },
          { label: 'Lighting', icon: 'pi pi-sun' }
        ]
      },
      { label: 'Contact', icon: 'pi pi-envelope' },
      { label: 'Shopping Cart', icon: 'pi pi-shopping-cart'}
    ];
  }
}