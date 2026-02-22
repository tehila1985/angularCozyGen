import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { UserLogin, UserRegister, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Users`;
  
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage(): UserResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: UserLogin): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userData).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }
}
