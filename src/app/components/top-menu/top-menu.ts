import { Component, OnInit, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../services/category';
import { StyleService } from '../../services/style';
import { UserService } from '../../services/user';
import { SearchComponent } from '../search/search';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [MenubarModule, RouterModule, SearchComponent, CommonModule],
  templateUrl: './top-menu.html',
  styleUrls: ['./top-menu.css'],
})
export class TopMenu implements OnInit {
  items: MenuItem[] = [];
  showSearch = false;

  private categoryService = inject(CategoryService);
  private styleService = inject(StyleService);
  private userService = inject(UserService);
  private router = inject(Router);

  availableCategories: any[] = [];
  availableStyles: any[] = [];
  currentUser$ = this.userService.currentUser$;

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
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.availableCategories = cats;
        this.updateMenu();
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  private loadStyles() {
    this.styleService.getStyles().subscribe({
      next: (styles) => {
        this.availableStyles = styles;
        this.updateMenu();
      },
      error: (err) => console.error('Error loading styles', err)
    });
  }

  private updateMenu() {
    if (!this.availableCategories.length || !this.availableStyles.length) return;

    const isLoggedIn = this.userService.isLoggedIn();
    const currentUser = this.userService.getCurrentUser();

    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/', fragment: 'home-section' },

      {
        label: 'Shop by Style',
        icon: 'pi pi-image',
        items: this.availableStyles.map(stl => ({
          label: stl.name.replace(/_/g, ' '),
          icon: 'pi pi-palette',
          command: () => this.navigateToProducts({ styleId: stl.styleId })
        }))
      },

      {
        label: 'Shop by Category',
        icon: 'pi pi-th-large',
        items: this.availableCategories.map(cat => ({
          label: cat.name,
          icon: 'pi pi-tag',
          command: () => this.navigateToProducts({ categoryId: cat.categoryId })
        }))
      },

      { label: 'Contact', icon: 'pi pi-envelope', routerLink: '/contact' },

      isLoggedIn ? {
        label: currentUser?.firstName || 'משתמש',
        icon: 'pi pi-user',
        items: [
          {
            label: 'התנתק',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      } : {
        label: 'התחבר',
        icon: 'pi pi-sign-in',
        routerLink: '/auth'
      }
    ];
  }

  private navigateToProducts(params: { categoryId?: number; styleId?: number }) {
    this.router.navigate(['/products'], { queryParams: params });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
    this.updateMenu();
  }
}