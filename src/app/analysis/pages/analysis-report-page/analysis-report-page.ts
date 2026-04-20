import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  AnalysisContainer,
  GapAnalysisResponse,
  TrainingPriority
} from '../../models/analysis.models';
import { AnalysisService } from '../../services/analysis.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { getUserIdFromToken } from '../../../core/utils/jwt.utils';
import { AnalysisStateService } from '../../services/analysis-state.service';

@Component({
  selector: 'app-analysis-report-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './analysis-report-page.html',
  styleUrl: './analysis-report-page.scss'
})
export class AnalysisReportPage {
  private readonly analysisService = inject(AnalysisService);
  private readonly analysisStateService = inject(AnalysisStateService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly report = signal<GapAnalysisResponse | null>(null);

  readonly analysis = computed<AnalysisContainer | null>(
    () => this.report()?.analysis ?? null
  );

  readonly topTrainingPriorities = computed<TrainingPriority[]>(() =>
    [...(this.analysis()?.training_priorities ?? [])]
      .sort((left, right) => right.priority_score - left.priority_score)
      .slice(0, 5)
  );

  async ngOnInit(): Promise<void> {
    const submittedAnalysis = this.analysisStateService.submittedAnalysis();

    if (submittedAnalysis) {
      this.report.set(submittedAnalysis);
      this.isLoading.set(false);
      return;
    }

    const token = this.authStorage.getToken();

    if (!token) {
      await this.router.navigate(['/login']);
      return;
    }

    try {
      const userId = getUserIdFromToken(token);
      const response = await firstValueFrom(this.analysisService.getAnalysis(userId));
      this.analysisStateService.setSubmittedAnalysis(response);
      this.report.set(response);
    } catch (error) {
      if (isTokenError(error)) {
        this.authStorage.clearSession();
        await this.router.navigate(['/login']);
        return;
      }

      this.errorMessage.set('Impossibile caricare l’analisi. Riprova più tardi.');
    } finally {
      this.isLoading.set(false);
    }
  }

  formatCoverageScore(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  formatPriorityScore(value: number): string {
    return value.toFixed(2);
  }

  formatTimestamp(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  gapTone(gap: number): 'critical' | 'warning' | 'good' {
    if (gap > 30) {
      return 'critical';
    }

    if (gap >= 10) {
      return 'warning';
    }

    return 'good';
  }
}

function isTokenError(error: unknown): boolean {
  return error instanceof Error && error.message === 'User ID not found in token';
}
