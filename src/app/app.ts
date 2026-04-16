import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStorageService } from './core/services/auth-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);
  private readonly hiddenShellRoutes = new Set(['/login', '/register']);

  showShell(): boolean {
    return this.authStorage.isAuthenticated() && !this.hiddenShellRoutes.has(this.router.url);
  }

  async logout(): Promise<void> {
    this.authStorage.clearSession();
    await this.router.navigate(['/login']);
  }
}
