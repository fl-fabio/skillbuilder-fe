import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { GapAnalysisResponse } from '../models/analysis.models';
import { environment } from '../../../environments/environment';
import {
  UserSkillInputPayload,
  UserSkillsSubmitResponse
} from '../../models/user-skills-submit.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getAnalysis(userId: string): Observable<GapAnalysisResponse> {
    return this.http
      .get<GapAnalysisResponse>(`${this.apiBaseUrl}/gap_analysis/${userId}`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(timeout(10000));
  }

  submitUserSkills(payload: UserSkillInputPayload): Observable<UserSkillsSubmitResponse> {
    return this.http
      .post<UserSkillsSubmitResponse>(`${this.apiBaseUrl}/user-skills/`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(timeout(10000));
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.authStorage.getToken();

    if (!token) {
      return undefined;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
