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
    return this.http.delete<void>(`${this.apiUrl}/Product/${id}`);
  }

  // Categories
  addCategory(category: AdminCategory): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(`${this.apiUrl}/Category`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Category/${id}`);
  }

  // Styles
  addStyle(style: AdminStyle): Observable<AdminStyle> {
    return this.http.post<AdminStyle>(`${this.apiUrl}/Style`, style);
  }

  deleteStyle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Style/${id}`);
  }

  // Check if user is admin
  checkIsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Users/IsAdmin`);
  }
}
