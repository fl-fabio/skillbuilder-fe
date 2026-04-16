import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private readonly selectedAreaIdSignal = signal<string | null>(null);
  private readonly selectedJobIdSignal = signal<string | null>(null);

  readonly selectedAreaId: Signal<string | null> = this.selectedAreaIdSignal.asReadonly();
  readonly selectedJobId: Signal<string | null> = this.selectedJobIdSignal.asReadonly();

  setSelectedAreaId(areaId: string): void {
    this.selectedAreaIdSignal.set(areaId);
  }

  setSelectedJobId(jobId: string): void {
    this.selectedJobIdSignal.set(jobId);
  }

  clearSelection(): void {
    this.selectedAreaIdSignal.set(null);
    this.selectedJobIdSignal.set(null);
  }
}
