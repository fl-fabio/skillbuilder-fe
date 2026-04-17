import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';
import { UsersService } from '../../services/user.service';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-skill-architecture-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-architecture-page.html',
  styleUrls: ['./skill-architecture-page.scss']
})
export class SkillArchitecturePage implements OnInit {

  constructor(
    public skillsService: SkillsService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carichiamo le skills all'avvio della pagina leggendo l'ID dal service
    const jobId = this.skillsService.selectedJobId();
    const job = this.skillsService.selectedJobTitle();
    
    const targetId = jobId || job?.id;

    if (targetId && this.skillsService.skills().length === 0) {
      this.skillsService.loadSkillsByJob(targetId);
    }
  }

  // ======================
  // SLIDER
  // ======================

  updateScore(skill: Skill, value: number) {
    this.skillsService.updateSkillScore(skill.skill_id, Number(value));
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

  trackBySkill(_: number, item: Skill) {
    return item.skill_id;
  }

  // ======================
  // NAVIGAZIONE
  // ======================

  goBack() {
    history.back();
  }

  submit() {
    const userId = this.usersService.loggedUserId();
    this.skillsService.submitAssessment(userId);
    this.router.navigate(['/users/skill-architecture/report']);
  }
}