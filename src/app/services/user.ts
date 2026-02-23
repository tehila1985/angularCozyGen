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
  
  private isAdminSubject = new BehaviorSubject<boolean>(this.checkInitialAdminStatus());
  public isAdmin$ = this.isAdminSubject.asObservable();

  private getUserFromStorage(): UserResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private checkInitialAdminStatus(): boolean {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') return true;
    
    const user = this.getUserFromStorage();
    return user?.role === 'Admin';
  }

  login(credentials: UserLogin): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(user => {
        console.log('Login response:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        const isAdmin = user.role === 'Admin';
        console.log('Is Admin:', isAdmin, 'Role:', user.role);
        this.isAdminSubject.next(isAdmin);
        localStorage.setItem('isAdmin', String(isAdmin));
      })
    );
  }

  register(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userData).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        const isAdmin = user.role === 'Admin';
        this.isAdminSubject.next(isAdmin);
        localStorage.setItem('isAdmin', String(isAdmin));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
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
    const user = this.getCurrentUser();
    if (user) {
      this.http.get<any>(`${this.apiUrl}/${user.userId}`).subscribe(
        fullUser => {
          const isAdmin = fullUser.role === 'Admin';
          this.isAdminSubject.next(isAdmin);
          localStorage.setItem('isAdmin', String(isAdmin));
          console.log('Admin status:', isAdmin, 'Role:', fullUser.role);
        },
        (error) => {
          console.warn('Admin check failed, defaulting to false', error);
          this.isAdminSubject.next(false);
          localStorage.removeItem('isAdmin');
        }
      );
    } else {
      this.isAdminSubject.next(false);
      localStorage.removeItem('isAdmin');
    }
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
