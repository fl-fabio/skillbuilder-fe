import { Component, inject, OnInit, signal } from '@angular/core';
import { AreaService } from '../../services/choice-area.service';

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

  areaService = inject(AreaService);
  areas = signal<Area[]>([]);

  async ngOnInit() {
    try {
      const areas = await this.areaService.getAreas();
      this.areas.set(areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  }

  readonly selectedAreaId = signal<string | null>(null);

  selectArea(id: string): void {
    if (this.selectedAreaId() === id) {
      this.selectedAreaId.set(null);
    } else {
      this.selectedAreaId.set(id);
    }
  }
}