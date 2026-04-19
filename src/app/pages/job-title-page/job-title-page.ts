import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompetencyService } from '../../services/competency.service';
import { SelectionService } from '../../services/selection.service';
import { JobTitle } from '../../models/competency.model';

@Component({
  selector: 'app-job-title-page',
  templateUrl: 'job-title-page.html',
  imports: [],
  styleUrl: 'job-title-page.scss',
  standalone: true
})
export class JobTitlePage implements OnInit {
  private readonly router = inject(Router);
  private readonly competencyService = inject(CompetencyService);
  private readonly selectionService = inject(SelectionService);

  readonly jobTitles = signal<JobTitle[]>([]);
  readonly selectedJobTitleId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadJobTitles();
  }

  private async loadJobTitles(): Promise<void> {
    const areaId = this.areaId;

    if (!areaId) {
      await this.router.navigate(['/choice-area']);
      return;
    }

    this.isLoading.set(true);
    try {
      const jobTitles = await this.competencyService.getJobTitlesByArea(areaId);
      this.jobTitles.set(
        jobTitles.map((jobTitle) => ({
          ...jobTitle,
          name:
            jobTitle.name ??
            (jobTitle as any).title ??
            (jobTitle as any).job_title ??
            ''
        }))
      );
      this.error.set(null);
    } catch (error) {
      console.error('Error loading job titles:', error);
      this.error.set('Errore nel caricamento dei job titles');
    } finally {
      this.isLoading.set(false);
    }
  }

  get areaId(): string | null {
    return this.selectionService.selectedAreaId();
  }

  selectJobTitle(jobTitle: JobTitle): void {
    this.selectedJobTitleId.set(jobTitle.id);
    this.competencyService.selectJobTitle(jobTitle.id);
    this.selectionService.setSelectedJobId(jobTitle.id);
  }

  proceedToSkillsEvaluation(): void {
    if (!this.selectedJobTitleId() || !this.areaId) {
      return;
    }

    this.router.navigate(['/skills-evaluation'], {
      queryParams: {
        areaId: this.areaId,
        jobTitleId: this.selectedJobTitleId()
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/choice-area']);
  }
}
