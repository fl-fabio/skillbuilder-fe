import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import {
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserProfile
} from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://82.165.174.28/api';

  getProfile(userId: string, token: string): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(this.buildUrl(`/users/${userId}`), {
        headers: this.createHeaders(token)
      })
      .pipe(timeout(10000));
  }

  updateProfile(
    userId: string,
    payload: UpdateUserRequest,
    token: string
  ): Observable<UpdateUserResponse> {
    return this.http
      .put<UpdateUserResponse>(this.buildUrl(`/users/${userId}`), payload, {
        headers: this.createHeaders(token)
      })
      .pipe(timeout(10000));
  }

  deleteProfile(userId: string, token: string): Observable<DeleteUserResponse> {
    return this.http
      .delete<DeleteUserResponse>(this.buildUrl(`/users/${userId}`), {
        headers: this.createHeaders(token)
      })
      .pipe(timeout(10000));
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
}
