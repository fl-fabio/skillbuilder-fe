import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
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
