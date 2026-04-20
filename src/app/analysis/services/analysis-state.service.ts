import { Injectable, Signal, signal } from '@angular/core';
import { GapAnalysisResponse } from '../models/analysis.models';
import { UserSkillsSubmitResponse } from '../../models/user-skills-submit.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisStateService {
  private readonly submittedAnalysisSignal = signal<GapAnalysisResponse | null>(null);

  readonly submittedAnalysis: Signal<GapAnalysisResponse | null> =
    this.submittedAnalysisSignal.asReadonly();

  setSubmittedAnalysis(response: GapAnalysisResponse | UserSkillsSubmitResponse): void {
    this.submittedAnalysisSignal.set(response);
  }

  clearSubmittedAnalysis(): void {
    this.submittedAnalysisSignal.set(null);
  }
}
