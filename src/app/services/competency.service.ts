import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CompetencyArea, JobTitle } from '../models/competency.model';
import { CompetencyApiService } from './competency-api.service';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  private readonly api = inject(CompetencyApiService);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedAreaId = signal<string | null>(null);
  readonly selectedJobTitleId = signal<string | null>(null);

  async getCompetencyAreas(): Promise<CompetencyArea[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      return await firstValueFrom(this.api.getCompetencyAreas());
    } catch (error) {
      this.error.set('Errore durante il caricamento delle aree di competenza.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getJobTitlesByArea(areaId: string): Promise<JobTitle[]> {
    this.isLoading.set(true);
    this.error.set(null);
    this.selectedAreaId.set(areaId);

    try {
      return await firstValueFrom(this.api.getJobTitlesByArea(areaId));
    } catch (error) {
      this.error.set('Errore durante il caricamento dei job title.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  selectJobTitle(jobTitleId: string): void {
    this.selectedJobTitleId.set(jobTitleId);
  }

  clearSelection(): void {
    this.selectedAreaId.set(null);
    this.selectedJobTitleId.set(null);
  }
}
