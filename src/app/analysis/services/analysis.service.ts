import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { GapAnalysisResponse } from '../models/analysis.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getAnalysis(userId: string): Observable<GapAnalysisResponse> {
    const token = this.authStorage.getToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      : undefined;

    return this.http
      .get<GapAnalysisResponse>(`${this.apiBaseUrl}/gap_analysis/${userId}`, {
        headers
      })
      .pipe(timeout(10000));
  }
}
