import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Area } from '../models/area.models';
import { firstValueFrom } from 'rxjs';
import { AreaApiService } from './area-api.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  api = inject(AreaApiService);

  isLoading = signal(false);
  error = signal<string | null>(null);

  async getAreas(): Promise<Area[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      return await firstValueFrom(this.api.getAreas());
    } catch (error) {
      this.error.set('Errore durante il caricamento aree.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }

  }
}