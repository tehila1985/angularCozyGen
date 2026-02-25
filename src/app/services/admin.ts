import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AdminProduct, AdminCategory, AdminStyle } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Products
  addProduct(product: AdminProduct): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.apiUrl}/Product`, product);
  }

  deleteProduct(id: number): Observable<void> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    return this.http.delete<void>(`${this.apiUrl}/Product/${id}`, { headers });
  }

  // Categories
  addCategory(category: AdminCategory): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(`${this.apiUrl}/Category`, category);
  }

  deleteCategory(id: number): Observable<void> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    return this.http.delete<void>(`${this.apiUrl}/Category/${id}`, { headers });
  }

  // Styles
  addStyle(style: AdminStyle): Observable<AdminStyle> {
    return this.http.post<AdminStyle>(`${this.apiUrl}/Style`, style);
  }

  deleteStyle(id: number): Observable<void> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    return this.http.delete<void>(`${this.apiUrl}/Style/${id}`, { headers });
  }

  // Check if user is admin
  checkIsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Users/IsAdmin`);
  }

  uploadProductImages(frontImage: File, backImage: File, product: AdminProduct): Observable<any> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('Current user from localStorage:', user);
    console.log('Product data:', product);
    console.log('UserId:', user.userId, 'Password exists:', !!user.password);
    
    const formData = new FormData();
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', product.price?.toString() || '0');
    formData.append('categoryId', product.categoryId?.toString() || '0');
    
    console.log('Sending FormData to:', `${this.apiUrl}/Product/upload`);
    
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    
    console.log('Headers:', headers);
    
    return this.http.post(`${this.apiUrl}/Product/upload`, formData, { headers });
  }

  uploadCategoryImage(image: File, category: AdminCategory): Observable<any> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', category.name || '');
    formData.append('description', category.description || '');
    
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    
    return this.http.post(`${this.apiUrl}/Category/upload`, formData, { headers });
  }

  uploadStyleImage(image: File, style: AdminStyle): Observable<any> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', style.name || '');
    formData.append('description', style.description || '');
    
    const headers = {
      'userId': user.userId?.toString() || '0',
      'password': user.password || ''
    };
    
    return this.http.post(`${this.apiUrl}/Style/upload`, formData, { headers });
  }
}
