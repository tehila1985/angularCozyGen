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

    // שליחת מערך הקטגוריות כפסיקים
    if (filters.categoryIds?.length) {
      params = params.set('categoryIds', filters.categoryIds.join(','));
    }

    // שליחת מערך הסטיילים כפסיקים
    if (filters.styleIds?.length) {
      params = params.set('styleIds', filters.styleIds.join(','));
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}