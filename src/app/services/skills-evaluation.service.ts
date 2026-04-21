import { inject, Injectable, signal } from '@angular/core';
import { Skill } from '../models/skill.model';
import { firstValueFrom } from 'rxjs';
import { SkillsEvaluationApiService } from './skills-evaluation.api.service';
import { UserSkillInputPayload } from '../models/user-skills-submit.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsEvaluationService {
  private api = inject(SkillsEvaluationApiService);
  isLoading = signal(false);
  error = signal<string | null>(null);
  selectedJobTitleId = signal<string | null>(null);
  skills = signal<Skill[]>([]);
  evaluationResults = signal<any[]>([]);

  async evaluateSkillsForJobTitle(jobTitleId: string): Promise<Skill[]> {
    this.isLoading.set(true);
    this.error.set(null);
    this.selectedJobTitleId.set(jobTitleId);
    
    try {
      const skills = await firstValueFrom(this.api.getSkillsForJobTitle(jobTitleId));
      skills.forEach(skill => {
        if (skill.user_score === undefined) {
          skill.user_score = 0; // Imposta un valore di default se user_score è undefined
        }
      });
      this.skills.set(skills);
      return skills;
    }
    catch (error) {
      console.error('Error evaluating skills:', error);
      this.error.set('Errore durante la valutazione delle competenze.');
      throw error;
    }
    finally {
      this.isLoading.set(false);
    }
  }

  updateSkillScore(skillId: string, score: number) {

    const updated = this.skills().map(s =>
      s.id === skillId
        ? { ...s, user_score: score }
        : s
    );

    this.skills.set(updated);
  }

  public buildSubmitPayload(
    userId: string,
    skillsArray: Skill[],
    areaId: string,
    jobId: string
  ): UserSkillInputPayload {
    return {
      user_id: userId,
      target: {
        area_id: areaId,
        job_id: jobId
      },
      consent_level: 1,
      skills: skillsArray.map((skill) => ({
        skill_id: skill.id,
        user_level: clampUserLevel(skill.user_score)
      }))
    };
  }
}

function clampUserLevel(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(10, value));
}
