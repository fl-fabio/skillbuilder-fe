import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetencyArea, JobTitle } from '../models/competency.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetencyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCompetencyAreas(): Observable<CompetencyArea[]> {
    return this.http.get<CompetencyArea[]>(`${this.baseUrl}/data/areas`);
  }

  getJobTitlesByArea(areaId: string): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(`${this.baseUrl}/data/job_titles?area_id=${areaId}`);
  }
}
