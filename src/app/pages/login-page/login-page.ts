import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { LoginRequest } from '../../models/auth.models';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly form: LoginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const payload: LoginRequest = this.form.getRawValue();
      const response = await firstValueFrom(this.authService.login(payload));

      this.authStorage.saveToken(response.access_token);
      this.authService.decodeTokenAndSetUser(response.access_token);
      await this.router.navigate(['/choice-area']);
    } catch (error) {
      this.errorMessage.set(mapLoginError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

function mapLoginError(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'Impossibile connettersi al server. Riprova più tardi.';
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 401) {
      return 'Email o password non corrette.';
    }

    if (error.status === 422) {
      return 'Controlla i dati inseriti.';
    }

    if (error.status === 0) {
      return 'Impossibile connettersi al server. Riprova più tardi.';
    }
  }

  return 'Si è verificato un errore. Riprova.';
}
