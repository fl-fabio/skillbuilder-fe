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
  private areaService = inject(AreaService);

  areas = signal<Area[]>([]);
  selectedAreaId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const fetchedAreas = await this.areaService.getAreas();
      this.areas.set(fetchedAreas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  }

  selectArea(id: string): void {
    if (this.selectedAreaId() === id) {
      this.selectedAreaId.set(null);
    } else {
      this.selectedAreaId.set(id);
    }
  }

  getIconForArea(areaName: string): string {
    if (!areaName) return ''; // Fallback se il nome è undefined o vuoto
    
    // Normalizziamo il testo per evitare problemi di maiuscole/minuscole
    const name = areaName.toLowerCase();

    // Logica più flessibile: basta che contenga una parola chiave
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

    // Se nessuna condizione viene soddisfatta, mostra un'icona di default
    // (Nel tuo caso metto Design.png come default per evitare riquadri vuoti)
    return 'icons/Design.png'; 
  }
}
