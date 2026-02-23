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
  
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  private getUserFromStorage(): UserResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: UserLogin): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.checkAdminStatus();
      })
    );
  }

  register(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userData).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.checkAdminStatus();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAdminSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  checkAdminStatus(): void {
    if (this.isLoggedIn()) {
      this.http.get<boolean>(`${this.apiUrl}/IsAdmin`).subscribe(
        isAdmin => {
          this.isAdminSubject.next(isAdmin);
          console.log('Admin status:', isAdmin);
        },
        (error) => {
          console.warn('Admin check failed, defaulting to false', error);
          this.isAdminSubject.next(false);
        }
      );
    } else {
      this.isAdminSubject.next(false);
    }
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
