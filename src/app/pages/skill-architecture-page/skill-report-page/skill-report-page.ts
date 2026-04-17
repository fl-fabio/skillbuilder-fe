import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkillsService } from '../../../services/skills.service';
import { ReportSlice } from '../../../models/skill.model';

@Component({
  selector: 'app-skill-report-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-report-page.html',
  styleUrls: ['./skill-report-page.scss']
})
export class SkillReportPage {

  // Gruppi di livello con colori
  readonly GROUPS = [
    { label: 'Principiante (1-2)', min: 1, max: 2,  color: '#ef4444' },
    { label: 'Base (3-4)',         min: 3, max: 4,  color: '#f97316' },
    { label: 'Intermedio (5-6)',   min: 5, max: 6,  color: '#eab308' },
    { label: 'Avanzato (7-8)',     min: 7, max: 8,  color: '#22c55e' },
    { label: 'Esperto (9-10)',     min: 9, max: 10, color: '#3b82f6' },
  ];

  constructor(
    public skillsService: SkillsService,
    private router: Router
  ) {}

  // ======================
  // PIE CHART
  // ======================

  getSlices(): ReportSlice[] {
    const skills = this.skillsService.skills();
    if (skills.length === 0) return [];

    let angle = 0;
    const slices: ReportSlice[] = [];

    for (const group of this.GROUPS) {
      const count = skills.filter(s => {
        const score = s.user_score ?? 5;
        return score >= group.min && score <= group.max;
      }).length;

      if (count === 0) continue;

      const percentage = Math.round((count / skills.length) * 100);
      const span = (count / skills.length) * 360;

      slices.push({
        label: group.label,
        count,
        color: group.color,
        percentage,
        startAngle: angle,
        endAngle: angle + span
      });

      angle += span;
    }

    return slices;
  }

  // Genera il path SVG per ogni fetta
  getSlicePath(startDeg: number, endDeg: number): string {
    // Caso: fetta occupa tutto il cerchio
    if (endDeg - startDeg >= 359.9) {
      return `M 50 10 A 40 40 0 1 1 49.999 10 Z`;
    }

    const cx = 50, cy = 50, r = 40;

    const start = this.degToRad(startDeg - 90);
    const end   = this.degToRad(endDeg   - 90);

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  }

  private degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  // ======================
  // HELPERS LABEL / COLORE
  // ======================

  getScoreLabel(score: number): string {
    if (score <= 2) return 'Principiante';
    if (score <= 4) return 'Base';
    if (score <= 6) return 'Intermedio';
    if (score <= 8) return 'Avanzato';
    return 'Esperto';
  }

  getScoreColor(score: number): string {
    if (score <= 2) return '#ef4444';
    if (score <= 4) return '#f97316';
    if (score <= 6) return '#eab308';
    if (score <= 8) return '#22c55e';
    return '#3b82f6';
  }

  trackBySlice(_: number, item: ReportSlice) {
    return item.label;
  }

  // ======================
  // NAVIGAZIONE
  // ======================

  goBack() {
    this.router.navigate(['/users/skill-architecture']);
  }
}
