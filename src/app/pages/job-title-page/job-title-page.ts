import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetencyService } from '../../services/competency.service';
import { JobTitle } from '../../models/competency.model';

@Component({
  selector: 'app-job-title-page',
  templateUrl: './job-title-page.html',
  styleUrl: './job-title-page.scss',
  standalone: true
})
export class JobTitlePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly competencyService = inject(CompetencyService);

  readonly jobTitles = signal<JobTitle[]>([]);
  readonly selectedJobTitleId = signal<string | null>(null);
  readonly areaId = signal<string | null>(null);

  get isLoading() {
    return this.competencyService.isLoading;
  }

  get error() {
    return this.competencyService.error;
  }

  async ngOnInit(): Promise<void> {
    const areaIdParam = this.route.snapshot.paramMap.get('areaId');

    if (!areaIdParam) {
      this.router.navigate(['/']);
      return;
    }

    this.areaId.set(areaIdParam);
    console.log('Loading job titles for area:', areaIdParam);

    try {
      const jobTitles = await this.competencyService.getJobTitlesByArea(areaIdParam);
      console.log('Job titles loaded:', jobTitles);
      this.jobTitles.set(jobTitles);
    } catch (error) {
      console.error('Error loading job titles:', error);
    }
  }

  selectJobTitle(jobTitle: JobTitle): void {
    this.selectedJobTitleId.set(jobTitle.id);
    this.competencyService.selectJobTitle(jobTitle.id);
  }

  proceedToSkillsEvaluation(): void {
    if (!this.selectedJobTitleId() || !this.areaId()) {
      return;
    }

    // Navigate to skills evaluation page with both area ID and job title ID
    this.router.navigate(['/skills-evaluation'], {
      queryParams: {
        areaId: this.areaId(),
        jobTitleId: this.selectedJobTitleId()
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/competency-areas']);
  }
}
