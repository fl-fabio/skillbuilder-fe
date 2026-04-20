import { Component, inject, OnInit, signal } from '@angular/core';
import { SelectionService } from '../../services/selection.service';
import { SkillsEvaluationService } from '../../services/skills-evaluation.service';
import { Router } from '@angular/router';
import { Skill, SkillType } from '../../models/skill.model';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { getUserIdFromToken } from '../../core/utils/jwt.utils';
import { AnalysisService } from '../../analysis/services/analysis.service';
import { AnalysisStateService } from '../../analysis/services/analysis-state.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-skills-evaluation',
  imports: [],
  templateUrl: './skills-evaluation.html',
  styleUrl: './skills-evaluation.scss',
})
export class SkillsEvaluation implements OnInit {
  private _router = inject(Router);
  private readonly authStorage = inject(AuthStorageService);
  private readonly analysisService = inject(AnalysisService);
  private readonly analysisStateService = inject(AnalysisStateService);
  selectionService = inject(SelectionService);
  skillsService = inject(SkillsEvaluationService);

  selectedAreaId = this.selectionService.selectedAreaId;
  selectedJobId = this.selectionService.selectedJobId;
  readonly submitError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  groupedSkills = () => this.computeGroupedSkills();

  skills = this.skillsService.skills;

  ngOnInit(): void {
    const jobTitleId = this.selectedJobId();
    if (jobTitleId) {
      this.skillsService.evaluateSkillsForJobTitle(jobTitleId);
    } else {
      this._router.navigate(['/choice-area']);
    }
  }

  updateScore(skill: Skill, value: number) {
    this.skillsService.updateSkillScore(skill.id, Number(value));
  }

  getSliderGradient(value: number = 5): string {
    const percent = ((value - 1) / 9) * 100;
    return `linear-gradient(
      to right,
      #93c5fd 0%,
      #3b82f6 ${percent}%,
      #f1f5f9 ${percent}%,
      #f1f5f9 100%
    )`;
  }

  goBack() {
    this.selectionService.clearSelection();
    this._router.navigate(['/job-title']);
  }

  async submit(): Promise<void> {
    this.submitError.set(null);

    const token = this.authStorage.getToken();

    if (!token) {
      await this._router.navigate(['/login']);
      return;
    }

    const areaId = this.selectedAreaId();
    const jobId = this.selectedJobId();

    if (!areaId || !jobId) {
      this.submitError.set('Seleziona di nuovo area e ruolo prima di inviare la valutazione.');
      return;
    }

    try {
      const userId = getUserIdFromToken(token);
      const payload = this.skillsService.buildSubmitPayload(
        userId,
        this.skills(),
        areaId,
        jobId
      );

      this.isSubmitting.set(true);
      const response = await firstValueFrom(this.analysisService.submitUserSkills(payload));

      this.analysisStateService.setSubmittedAnalysis(response);
      await this._router.navigate(['/analysis-report']);
    } catch (error) {
      if (isTokenError(error)) {
        this.authStorage.clearSession();
        await this._router.navigate(['/login']);
        return;
      }

      console.error('Error submitting skills evaluation:', error);
      this.submitError.set(
        'Non siamo riusciti a salvare la tua valutazione. Riprova tra qualche istante.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getTypeLabel(type: SkillType): string {
    switch (type) {
      case 'Language':
        return 'Linguaggi';
      case 'framework':
        return 'Framework';
      case 'software':
        return 'Software e strumenti';
      case 'knowledge':
        return 'Conoscenze';
      default:
        return type;
    }
  }

  private computeGroupedSkills() {
    const skills = this.skills();

    const typeOrder: SkillType[] = ['Language', 'framework', 'software', 'knowledge'];

    const groupedMap = new Map<SkillType, Skill[]>();

    for (const skill of skills) {
      const currentGroup = groupedMap.get(skill.type) ?? [];
      currentGroup.push(skill);
      groupedMap.set(skill.type, currentGroup);
    }

    return typeOrder
      .filter(type => groupedMap.has(type))
      .map(type => ({
        type,
        label: this.getTypeLabel(type),
        skills: groupedMap.get(type) ?? [],
      }));
  }

}

function isTokenError(error: unknown): boolean {
  return error instanceof Error && error.message === 'User ID not found in token';
}
