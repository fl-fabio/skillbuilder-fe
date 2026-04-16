import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  readonly areas = signal<Area[]>([]);
  readonly selectedAreaId = signal<string | null>(null);
  readonly selectedArea = computed(
    () => this.areas().find((area) => area.id === this.selectedAreaId()) ?? null
  );

  get isLoading() {
    return this.areaService.isLoading;
  }

  get error() {
    return this.areaService.error;
  }

  async ngOnInit(): Promise<void> {
    this.selectedAreaId.set(this.selectionService.selectedAreaId());

    try {
      const fetchedAreas = await this.areaService.getAreas();
      this.areas.set(fetchedAreas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  }

  // Questa funzione ora seleziona solo la card senza navigare
  selectArea(id: string): void {
    this.selectedAreaId.set(id);
    this.selectionService.setSelectedAreaId(id);
  }

  // Nuova funzione associata al click del bottone "Avanti"
  goNext(): void {
    if (this.selectedAreaId()) {
      this.router.navigate(['/job-title']);
    }
  }

  getDisplayAreaName(areaName: string): string {
    const normalizedName = areaName.trim().toLowerCase();

    if (normalizedName.includes('sviluppo soft') || normalizedName.includes('sviluppo software')) {
      return 'Sviluppo Software';
    }

    if (normalizedName.includes('cloud') || normalizedName.includes('devops')) {
      return 'Cloud & DevOps';
    }

    if (normalizedName.includes('data') || normalizedName.includes('ai')) {
      return 'Data AI';
    }

    if (normalizedName.includes('cyber')) {
      return 'Cybersecurity';
    }

    if (normalizedName.includes('design') || normalizedName.includes('ux') || normalizedName.includes('ui')) {
      return 'Design UX/UI';
    }

    return areaName;
  }

  getIconForArea(areaName: string): string {
    if (!areaName) return ''; 
    
    const name = this.getDisplayAreaName(areaName).toLowerCase();

    if (name.includes('sviluppo') || name.includes('software')) {
      return 'icons/Sviluppo_soft.png';
    }
    if (name.includes('cybersecurity')) {
      return 'icons/Cybersecurity.png';
    }
    if (name.includes('design') || name.includes('ux')) {
      return 'icons/Design.png';
    }
    if (name.includes('cloud') || name.includes('devops')) {
      return 'icons/DevOps_Cloud.png';
    }
    if (name.includes('data') || name.includes('ai')) {
      return 'icons/Data_AI.png';
    }

    return 'icons/Design.png'; 
  }
}
