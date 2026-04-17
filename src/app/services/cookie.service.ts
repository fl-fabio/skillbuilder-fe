import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  public cookie = signal<string | null>(null);

  setCookie(value: string): void {
    this.cookie.set(value);
  }

  clearCookie(): void {
    this.cookie.set(null);
  }
}
