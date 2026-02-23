import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../services/category';
import { StyleService } from '../../services/style';
import { UserService } from '../../services/user';
import { CartService } from '../../services/cart';
import { SearchComponent } from '../search/search';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [RouterModule, SearchComponent, CommonModule],
  templateUrl: './top-menu.html',
  styleUrls: ['./top-menu.css'],
})
export class TopMenu implements OnInit {
  showSearch = false;
  mobileMenuOpen = false;
  mobileDropdowns: { [key: string]: boolean } = {};
  cartCount = 0;

  private categoryService = inject(CategoryService);
  private styleService = inject(StyleService);
  public userService = inject(UserService);
  private cartService = inject(CartService);
  private router = inject(Router);
  public location = inject(Location);

  availableCategories: any[] = [];
  availableStyles: any[] = [];

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(filters: any) {
    this.router.navigate(['/products'], { 
      queryParams: { 
        search: filters.desc 
      },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.showSearch = false;
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadStyles();
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    
    // עדכון מיידי של מספר הפריטים בסל
    this.router.events.subscribe(() => {
      this.cartService.updateCartCount();
    });
    
    // בדיקת הרשאות מנהל
    this.userService.checkAdminStatus();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.availableCategories = cats;
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  private loadStyles() {
    this.styleService.getStyles().subscribe({
      next: (styles) => {
        this.availableStyles = styles;
      },
      error: (err) => console.error('Error loading styles', err)
    });
  }

  navigateToProducts(params: { categoryId?: number; styleId?: number }) {
    this.router.navigate(['/products'], { queryParams: params });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleMobileDropdown(key: string) {
    this.mobileDropdowns[key] = !this.mobileDropdowns[key];
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }
}