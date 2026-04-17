import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Area, JobTitle, Skill, UserSkillPayload } from '../models/skill.model';

interface ApiSkill {
  id: string;
  skill: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private DATA_API = 'http://82.165.174.28/api/data';   // ✅ BASE CORRETTA (senza /skills)
  private MAIN_API = 'http://82.165.174.28/api';

  // ======================
  // STATE (Signals)
  // ======================

  areas           = signal<Area[]>([]);
  selectedArea    = signal<Area | null>(null);

  jobTitles         = signal<JobTitle[]>([]);
  selectedJobTitle  = signal<JobTitle | null>(null);
  selectedJobId     = signal<number | null>(null);  // Requisito nuovo del mega-prompt

  skills  = signal<Skill[]>([]);
  loading = signal(false);
  error   = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // ======================
  // AREE
  // ======================

  loadAreas() {
    this.http.get<Area[]>(`${this.DATA_API}/areas`)  // ✅ /api/data/areas
      .subscribe({
        next:  res => this.areas.set(res),
        error: err => {
          console.error('Errore caricamento aree:', err);
          this.error.set('Errore caricamento aree');
        }
      });
  }

  selectArea(area: Area) {
    this.selectedArea.set(area);
    this.selectedJobTitle.set(null);
    this.jobTitles.set([]);
    this.skills.set([]);
    this.loadJobTitles(area.id);
  }

  // ======================
  // JOB TITLES
  // ======================

  loadJobTitles(areaId: string) {
    this.http.get<JobTitle[]>(`${this.DATA_API}/job_titles/area/${areaId}`)
      .subscribe({
        next:  res => this.jobTitles.set(res),
        error: err => {
          console.error('Errore caricamento ruoli:', err);
          this.error.set('Errore caricamento ruoli');
        }
      });
  }

  selectJobTitle(job: JobTitle) {
    this.selectedJobTitle.set(job);
    this.skills.set([]);
    this.loadSkillsByJob(job.id);
  }

  // ======================
  // SKILLS
  // ======================

  loadSkillsByJob(jobTitleId: number) {

    this.loading.set(true);
    this.error.set(null);
    this.skills.set([]);

    this.http.get<ApiSkill[]>(
      `${this.DATA_API}/skills/${jobTitleId}`   // ✅ PATH PARAM: GET /data/skills/{role_id}
    )
    .subscribe({
      next: res => {

        const mapped: Skill[] = res.map(s => ({
          skill_id:       Number(s.id),
          name:           s.skill,
          category:       s.type,
          expected_level: 0,
          weight:         1,
          job_title_id:   jobTitleId,
          user_score:     5              // default
        }));

        this.skills.set(mapped);
        this.loading.set(false);
      },
      error: err => {
        console.error('Errore caricamento skills:', err);
        this.error.set('Errore caricamento skills');
        this.loading.set(false);
      }
    });
  }

  updateSkillScore(skillId: number, score: number) {

    const updated = this.skills().map(s =>
      s.skill_id === skillId
        ? { ...s, user_score: score }
        : s
    );

    this.skills.set(updated);
  }

  // ======================
  // SUBMIT — POST /api/user-skills/
  // ======================

  submitAssessment(userId: number) {

    const job  = this.selectedJobTitle();
    const jobId = this.selectedJobId();
    const area = this.selectedArea();

    const targetJobId = job?.id || jobId;

    if (!targetJobId) {
      this.error.set('Seleziona area e ruolo prima di procedere');
      return;
    }

    // ✅ Payload corretto come da swagger
    const payload: UserSkillPayload = {
      timestamp:     new Date().toISOString(),
      user_id:       userId.toString(),
      target: {
        area_id: area?.id || "default_area", // Fallback string
        job_id:  targetJobId
      },
      consent_level: 1,
      skills: this.skills().map(s => ({
        skill_id:   s.skill_id,
        user_level: s.user_score ?? 5
      }))
    };

    console.log('Payload inviato:', payload);
    this.loading.set(true);

    this.http.post(`${this.MAIN_API}/user-skills/`, payload)
      .subscribe({
        next: res => {
          console.log('Assessment inviato correttamente ✅', res);
          this.loading.set(false);
        },
        error: err => {
          console.error('Errore submit assessment:', err);
          this.error.set('Errore durante invio assessment');
          this.loading.set(false);
        }
      });
  }
}