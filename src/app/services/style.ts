import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Style`;

  getStyles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}