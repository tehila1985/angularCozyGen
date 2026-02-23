import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopMenu } from '../../components/top-menu/top-menu';
import { AdminService } from '../../services/admin';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { StyleService } from '../../services/style';
import { AdminProduct, AdminCategory, AdminStyle } from '../../models/admin.model';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TopMenu],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private styleService = inject(StyleService);

  activeTab: 'products' | 'categories' | 'styles' = 'products';
  baseUrl = environment.apiUrl.replace('/api', '');
  
  products: any[] = [];
  categories: any[] = [];
  styles: any[] = [];

  newProduct: AdminProduct = {
    name: '',
    description: '',
    price: 0,
    frontImageUrl: '',
    backImageUrl: '',
    categoryId: 0,
    styleId: 0
  };

  newCategory: AdminCategory = { name: '', description: '', imageUrl: '' };
  newStyle: AdminStyle = { name: '', description: '', imageUrl: '' };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts({ position: 0, skip: 1000 }).subscribe(data => {
      const productsFromServer = data.products || [];
      this.products = productsFromServer.map((p: any) => {
        const cleanPath = (path: string) => path?.startsWith('/') ? path.substring(1) : path;
        const frontUrl = p.frontImageUrl?.startsWith('http') ? p.frontImageUrl : `${this.baseUrl}/${cleanPath(p.frontImageUrl)}`;
        const backUrl = p.backImageUrl?.startsWith('http') ? p.backImageUrl : `${this.baseUrl}/${cleanPath(p.backImageUrl)}`;
        return {
          ...p,
          frontImageUrl: frontUrl,
          backImageUrl: backUrl
        };
      });
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.styleService.getStyles().subscribe(data => {
      this.styles = data;
    });
  }

  // Products
  addProduct() {
    this.adminService.addProduct(this.newProduct).subscribe(() => {
      this.loadData();
      this.resetProductForm();
    });
  }

  deleteProduct(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      this.adminService.deleteProduct(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  resetProductForm() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      frontImageUrl: '',
      backImageUrl: '',
      categoryId: 0,
      styleId: 0
    };
  }

  // Categories
  addCategory() {
    this.adminService.addCategory(this.newCategory).subscribe(() => {
      this.loadData();
      this.newCategory = { name: '', description: '', imageUrl: '' };
    });
  }

  deleteCategory(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      this.adminService.deleteCategory(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Styles
  addStyle() {
    this.adminService.addStyle(this.newStyle).subscribe(() => {
      this.loadData();
      this.newStyle = { name: '', description: '', imageUrl: '' };
    });
  }

  deleteStyle(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק סגנון זה?')) {
      this.adminService.deleteStyle(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
