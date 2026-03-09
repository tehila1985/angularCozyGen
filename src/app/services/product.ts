import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Product`;

  getProducts(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('position', filters.position?.toString() || '0')
      .set('skip', filters.skip?.toString() || '40')
      .set('desc', filters.desc || '')
      .set('minPrice', filters.minPrice?.toString() || '0')
      .set('maxPrice', filters.maxPrice?.toString() || '999999');

    if (filters.categoryIds?.length) {
      params = params.set('categoryIds', filters.categoryIds.join(','));
    }

    if (filters.styleIds?.length) {
      params = params.set('styleIds', filters.styleIds.join(','));
    }

    if (filters.productIds?.length) {
      params = params.set('productIds', filters.productIds.join(','));
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ===== נוסף עבור הקריאה ל-AI - מחזיר מוצרים לפי רשימת IDs =====
  getProductsByIds(ids: number[]): Observable<any[]> {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('ids', id.toString());
    });
    return this.http.get<any[]>(`${this.apiUrl}/by-ids`, { params });
  }

  validateStock(productIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-stock`, productIds);
  }
}
