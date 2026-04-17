import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SkillsService } from '../../../services/skills.service';

@Component({
  selector: 'app-skill-area-page',
  standalone: true,
  templateUrl: './skill-area-page.component.html'
})
export class SkillAreaPageComponent {

  constructor(
    private router: Router,
    private skillsService: SkillsService
  ) {}
  startDemo() {
    this.skillsService.selectedJobId.set(40);
    this.router.navigate(['/users/skill-architecture']);
  }
}

