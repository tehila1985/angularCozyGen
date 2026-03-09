import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ai`;

  analyzeImage(imageFile: File): Observable<{ productIds: number[] }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{ productIds: number[] }>(`${this.apiUrl}/analyze`, formData);
  }
}
