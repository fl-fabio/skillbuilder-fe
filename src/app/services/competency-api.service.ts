import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetencyArea, JobTitle } from '../models/competency.model';

@Injectable({
  providedIn: 'root'
})
export class CompetencyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://82.165.174.28/api';

  getCompetencyAreas(): Observable<CompetencyArea[]> {
    return this.http.get<CompetencyArea[]>(`${this.baseUrl}/data/areas`);
  }

  getJobTitlesByArea(areaId: string): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(`${this.baseUrl}/data/job-titles/area/${areaId}`);
  }
}
