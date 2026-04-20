import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInformation
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://82.165.174.28/api';
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  public userInformation = signal<UserInformation | null>(null);

  public decodeTokenAndSetUser(token: string): void {
    if (!token) return;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(base64);
      const decoded = JSON.parse(decodedJson);
      this.userInformation.set({
        user_id: decoded.user_id || decoded.sub, // `sub` è la proprietà standard in cui i JWT salvano l'ID utente
        email: decoded.email,
      });
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
    }
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiBaseUrl + '/auth/login', payload, {
        headers: this.jsonHeaders
      })
      .pipe(timeout(10000));
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(this.apiBaseUrl + '/auth/register', payload, {
        headers: this.jsonHeaders
      })
      .pipe(timeout(10000));
  }

/*   private buildUrl(path: string): string {
    const normalizedBaseUrl = this.apiBaseUrl.replace(/\/$/, '');

    return normalizedBaseUrl ? `${normalizedBaseUrl}${path}` : path;
  } */
}
