import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { RegisterRequest } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';

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
        name: rawValue.name,
        surname: rawValue.surname,
        email: rawValue.email,
        password: rawValue.password,
        privacy_level: rawValue.privacyAccepted ? 1 : 0
      };

      await firstValueFrom(this.authService.register(payload));
      await this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage.set(mapRegisterError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }
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
