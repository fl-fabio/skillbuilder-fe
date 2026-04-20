import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterPrivacyLevel, RegisterRequest, RegisterResponse } from '../../models/auth.models';

type RegisterForm = FormGroup<{
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  privacyAccepted: FormControl<boolean>;
}>;

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: '../login-page/login-page.scss'
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly acceptedPrivacyLevel: RegisterPrivacyLevel = '1';

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly form: RegisterForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    surname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    privacyAccepted: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    })
  });

  get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  get surnameControl(): FormControl<string> {
    return this.form.controls.surname;
  }

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  get privacyAcceptedControl(): FormControl<boolean> {
    return this.form.controls.privacyAccepted;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const rawValue = this.form.getRawValue();
      const payload: RegisterRequest = {
        name: rawValue.name.trim(),
        surname: rawValue.surname.trim(),
        email: rawValue.email.trim(),
        password: rawValue.password,
        privacy_level: this.acceptedPrivacyLevel
      };

      const response = await firstValueFrom(this.authService.register(payload));

      if (!isRegisterResponse(response)) {
        throw new Error('Invalid register response');
      }

      console.log('Register success response:', response);
      this.errorMessage.set('');
      this.isSubmitting.set(false);
      await this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage.set(mapRegisterError(error));
    } finally {
      if (this.isSubmitting()) {
        this.isSubmitting.set(false);
      }
    }
  }
}

function isRegisterResponse(response: unknown): response is RegisterResponse {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return false;
  }

  const candidate = response as Record<string, unknown>;
  const acceptedAt = candidate['accepted_at'];

  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['name'] === 'string' &&
    typeof candidate['surname'] === 'string' &&
    typeof candidate['email'] === 'string' &&
    isRegisterPrivacyLevel(candidate['privacy_level']) &&
    (acceptedAt === undefined || acceptedAt === null || typeof acceptedAt === 'string')
  );
}

function isRegisterPrivacyLevel(value: unknown): value is RegisterPrivacyLevel {
  return value === '1' || value === '2';
}

function mapRegisterError(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'Impossibile connettersi al server. Riprova più tardi.';
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 422) {
      return 'Controlla i dati inseriti.';
    }

    if (error.status === 0) {
      return 'Impossibile connettersi al server. Riprova più tardi.';
    }
  }

  return 'Si è verificato un errore. Riprova.';
}
