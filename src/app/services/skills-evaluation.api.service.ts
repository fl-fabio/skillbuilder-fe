import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsEvaluationApiService {
  http = inject(HttpClient);
  baseUrl = 'http://82.165.174.28/api';

  getSkillsForJobTitle(jobTitleId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/data/skills/${jobTitleId}`);  
  }
}
