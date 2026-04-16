import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AreaService } from '../../services/choice-area.service';
import { SelectionService } from '../../services/selection.service';

export interface Area {
  id: string;
  area: string;
  description: string;
}

@Component({
  selector: 'app-choise-area-page',
  imports: [],
  templateUrl: './choice-area.html',
  styleUrl: './choice-area.scss',
  standalone: true
})
export class ChoiceAreaPage implements OnInit {
  private readonly router = inject(Router);
  private readonly selectionService = inject(SelectionService);
  private readonly areaService = inject(AreaService);

  areas = signal<Area[]>([]);
  readonly selectedAreaId = signal<string | null>(null);

  async ngOnInit() {
    try {
      const areas = await this.areaService.getAreas();
      this.areas.set(areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  }

  selectArea(id: string): void {
    this.selectedAreaId.set(id);
    this.selectionService.setSelectedAreaId(id);
    this.router.navigate(['/job-title']);
  }
}