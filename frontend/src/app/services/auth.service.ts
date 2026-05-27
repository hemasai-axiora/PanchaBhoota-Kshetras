import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5000/api/auth';
  private currentAdminSubject = new BehaviorSubject<any>(null);
  currentAdmin$ = this.currentAdminSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkLocalSession();
    }
  }

  // Login Administrator
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          if (this.isBrowser) {
            localStorage.setItem('admin_token', response.token);
            localStorage.setItem('admin_user', JSON.stringify(response.admin));
          }
          this.currentAdminSubject.next(response.admin);
        }
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  // Logout Administrator
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    this.currentAdminSubject.next(null);
  }

  // Check if admin is currently authenticated
  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    const token = localStorage.getItem('admin_token');
    return !!token;
  }

  // Retrieve current user metadata
  getAdminUser() {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }

  // Internal helper to restore session from LocalStorage
  private checkLocalSession() {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (token && user) {
      this.currentAdminSubject.next(JSON.parse(user));
    }
  }
}
