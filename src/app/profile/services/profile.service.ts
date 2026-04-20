import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, retry, throwError, timeout, timer } from 'rxjs';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { getEmailFromToken } from '../../core/utils/jwt.utils';
import {
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserProfile
} from '../models/profile.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  async getCurrentUser(): Promise<UserProfile> {
    const token = this.authStorage.getToken();

    if (!token) {
      throw new Error('Missing auth token');
    }

    const usersUrl = this.buildUrl('/users');
    const maskedToken = this.maskToken(token);
    const email = getEmailFromToken(token);

    console.log('Profile token:', maskedToken);
    console.log('Extracted email:', email);
    console.log('Profile request URL:', usersUrl);

    const users = await firstValueFrom(
      this.http
        .get<UserProfile[]>(usersUrl, {
          headers: this.createHeaders(token)
        })
        .pipe(this.applyRequestPolicy())
    );

    console.log('Users list:', users);

    const user = users.find((currentUser) => currentUser.email === email);

    console.log('Matched user:', user);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  getProfile(userId: string, token: string): Observable<UserProfile> {
    const requestUrl = this.buildUrl(`/users/${userId}`);

    console.log('Final userId used:', userId);
    console.log('Profile request URL:', requestUrl);

    return this.http
      .get<UserProfile>(requestUrl, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy());
  }

  updateProfile(
    userId: string,
    payload: UpdateUserRequest,
    token: string
  ): Observable<UpdateUserResponse> {
    const requestUrl = this.buildUrl(`/users/${userId}`);

    console.log('Final userId used:', userId);
    console.log('Profile request URL:', requestUrl);

    return this.http
      .put<UpdateUserResponse>(requestUrl, payload, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy());
  }

  deleteProfile(userId: string, token: string): Observable<DeleteUserResponse> {
    const requestUrl = this.buildUrl(`/users/${userId}`);

    console.log('Final userId used:', userId);
    console.log('Profile request URL:', requestUrl);

    return this.http
      .delete<DeleteUserResponse>(requestUrl, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy());
  }

  private buildUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private maskToken(token: string): string {
    if (token.length <= 10) {
      return '***';
    }

    return `${token.slice(0, 6)}...${token.slice(-4)}`;
  }

  private applyRequestPolicy<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        timeout(10000),
        retry({
          count: 1,
          delay: (error) => {
            if (error instanceof HttpErrorResponse && error.status === 0) {
              return timer(300);
            }

            return throwError(() => error);
          }
        })
      );
  }
}
