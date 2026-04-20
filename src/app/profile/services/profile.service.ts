import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, retry, throwError, timeout, timer } from 'rxjs';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import {
  DeleteUserResponse,
  PrivacyLevel,
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

  getUserProfile(userId: string): Observable<UserProfile> {
    const token = this.authStorage.getToken();

    if (!token) {
      throw new Error('Missing auth token');
    }

    const requestUrl = this.buildProfileUrl(userId);

    return this.http
      .get<UserProfileApiResponse>(requestUrl, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy(), map((response) => this.mapUserProfile(response)));
  }

  updateProfile(
    userId: string,
    payload: UpdateUserRequest,
    token: string
  ): Observable<UpdateUserResponse> {
    const requestUrl = this.buildProfileUrl(userId);

    return this.http
      .put<UserProfileApiResponse>(requestUrl, payload, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy(), map((response) => this.mapUserProfile(response)));
  }

  deleteProfile(userId: string, token: string): Observable<DeleteUserResponse> {
    const requestUrl = this.buildProfileUrl(userId);

    return this.http
      .delete<DeleteUserResponse>(requestUrl, {
        headers: this.createHeaders(token)
      })
      .pipe(this.applyRequestPolicy());
  }

  private buildProfileUrl(userId: string): string {
    return this.buildUrl(`/auth/${userId}`);
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

  private mapUserProfile(response: UserProfileApiResponse): UserProfile {
    if (!this.isUserProfileApiResponse(response)) {
      throw new Error('Invalid profile response');
    }

    return {
      id: response.id,
      name: response.name,
      surname: response.surname,
      email: response.email,
      privacy_level: response.privacy_level,
      accepted_at: response.accepted_at
    };
  }

  private isUserProfileApiResponse(value: unknown): value is UserProfileApiResponse {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
      typeof candidate['id'] === 'string' &&
      typeof candidate['name'] === 'string' &&
      typeof candidate['surname'] === 'string' &&
      typeof candidate['email'] === 'string' &&
      this.isPrivacyLevel(candidate['privacy_level']) &&
      (candidate['accepted_at'] === undefined ||
        candidate['accepted_at'] === null ||
        typeof candidate['accepted_at'] === 'string')
    );
  }

  private isPrivacyLevel(value: unknown): value is PrivacyLevel {
    return value === '1' || value === '2';
  }
}

interface UserProfileApiResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  privacy_level: PrivacyLevel;
  accepted_at?: string | null;
}
