import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Configurable base URL: matches backend Docker port or standard node port
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Helper to construct authorization headers
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  // --- Temple APIs ---
  getTemples(search?: string, element?: string): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (element && element !== 'All') {
      params = params.set('element', element);
    }
    return this.http.get(`${this.baseUrl}/temples`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getTempleById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/temples/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createTemple(templeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/temples`, templeData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateTemple(id: string, templeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/temples/${id}`, templeData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTemple(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/temples/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // --- Gallery APIs ---
  getGallery(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Contact APIs ---
  submitContact(contactData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contacts`, contactData).pipe(
      catchError(this.handleError)
    );
  }

  getContacts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/contacts`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateContactStatus(id: string, status: 'Read' | 'Unread'): Observable<any> {
    return this.http.put(`${this.baseUrl}/contacts/${id}`, { status }, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/contacts/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Common Error Handler
  private handleError(error: any) {
    let errorMessage = 'An unknown spiritual connection error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
