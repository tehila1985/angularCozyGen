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

  frontImageFile: File | null = null;
  backImageFile: File | null = null;
  frontImagePreview: string = '';
  backImagePreview: string = '';
  uploadMessage: string = '';
  uploadError: string = '';

  categoryImageFile: File | null = null;
  categoryImagePreview: string = '';
  categoryMessage: string = '';
  categoryError: string = '';

  styleImageFile: File | null = null;
  styleImagePreview: string = '';
  styleMessage: string = '';
  styleError: string = '';

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

  onFrontImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.frontImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.frontImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.backImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.backImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.categoryImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onStyleImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.styleImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.styleImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    this.uploadMessage = '';
    this.uploadError = '';
    
    if (this.frontImageFile && this.backImageFile) {
      this.uploadMessage = 'מעלה תמונות...';
      
      this.adminService.uploadProductImages(this.frontImageFile, this.backImageFile, this.newProduct).subscribe({
        next: () => {
          this.uploadMessage = 'המוצר נוסף בהצלחה!';
          this.loadData();
          this.resetProductForm();
          setTimeout(() => this.uploadMessage = '', 3000);
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'שגיאה לא ידועה';
          this.uploadError = 'שגיאה: ' + errorMsg;
        }
      });
    } else {
      this.adminService.addProduct(this.newProduct).subscribe({
        next: () => {
          this.uploadMessage = 'המוצר נוסף בהצלחה!';
          this.loadData();
          this.resetProductForm();
          setTimeout(() => this.uploadMessage = '', 3000);
        },
        error: () => {
          this.uploadError = 'שגיאה בהוספת המוצר';
        }
      });
    }
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
    this.frontImageFile = null;
    this.backImageFile = null;
    this.frontImagePreview = '';
    this.backImagePreview = '';
    this.uploadMessage = '';
    this.uploadError = '';
  }

  addCategory() {
    this.categoryMessage = '';
    this.categoryError = '';
    
    if (this.categoryImageFile) {
      this.categoryMessage = 'מעלה תמונה...';
      
      this.adminService.uploadCategoryImage(this.categoryImageFile, this.newCategory).subscribe({
        next: () => {
          this.categoryMessage = 'הקטגוריה נוספה בהצלחה!';
          this.loadData();
          this.resetCategoryForm();
          setTimeout(() => this.categoryMessage = '', 3000);
        },
        error: (err) => {
          this.categoryError = 'שגיאה: ' + (err.error?.message || err.message);
        }
      });
    } else {
      this.adminService.addCategory(this.newCategory).subscribe({
        next: () => {
          this.categoryMessage = 'הקטגוריה נוספה בהצלחה!';
          this.loadData();
          this.resetCategoryForm();
          setTimeout(() => this.categoryMessage = '', 3000);
        },
        error: () => {
          this.categoryError = 'שגיאה בהוספת הקטגוריה';
        }
      });
    }
  }

  resetCategoryForm() {
    this.newCategory = { name: '', description: '', imageUrl: '' };
    this.categoryImageFile = null;
    this.categoryImagePreview = '';
  }

  deleteCategory(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      this.adminService.deleteCategory(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  addStyle() {
    this.styleMessage = '';
    this.styleError = '';
    
    if (this.styleImageFile) {
      this.styleMessage = 'מעלה תמונה...';
      
      this.adminService.uploadStyleImage(this.styleImageFile, this.newStyle).subscribe({
        next: () => {
          this.styleMessage = 'הסגנון נוסף בהצלחה!';
          this.loadData();
          this.resetStyleForm();
          setTimeout(() => this.styleMessage = '', 3000);
        },
        error: (err) => {
          this.styleError = 'שגיאה: ' + (err.error?.message || err.message);
        }
      });
    } else {
      this.adminService.addStyle(this.newStyle).subscribe({
        next: () => {
          this.styleMessage = 'הסגנון נוסף בהצלחה!';
          this.loadData();
          this.resetStyleForm();
          setTimeout(() => this.styleMessage = '', 3000);
        },
        error: () => {
          this.styleError = 'שגיאה בהוספת הסגנון';
        }
      });
    }
  }

  resetStyleForm() {
    this.newStyle = { name: '', description: '', imageUrl: '' };
    this.styleImageFile = null;
    this.styleImagePreview = '';
  }

  deleteStyle(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק סגנון זה?')) {
      this.adminService.deleteStyle(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
