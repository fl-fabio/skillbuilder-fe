import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { getUserIdFromToken } from '../../../core/utils/jwt.utils';
import { UpdateUserRequest } from '../../models/profile.models';
import { ProfileService } from '../../services/profile.service';

type ProfileForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number | null>;
}>;

@Component({
  selector: 'app-profile-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile-edit-page.html',
  styleUrl: './profile-edit-page.scss'
})
export class ProfileEditPage {
  private readonly profileService = inject(ProfileService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  private token: string | null = null;
  private userId: string | null = null;

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly isDeleting = signal(false);
  readonly hasProfile = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly form: ProfileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    age: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    })
  });

  constructor() {
    this.form.disable();
  }

  get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get ageControl(): FormControl<number | null> {
    return this.form.controls.age;
  }

  async ngOnInit(): Promise<void> {
    const token = this.authStorage.getToken();

    if (!token) {
      await this.router.navigate(['/login']);
      return;
    }

    this.token = token;

    try {
      this.userId = getUserIdFromToken(token);
    } catch {
      this.authStorage.clearSession();
      await this.router.navigate(['/login']);
      return;
    }

    try {
      const profile = await firstValueFrom(
        this.profileService.getProfile(this.userId, token)
      );

      this.form.reset({
        name: profile.name ?? '',
        email: profile.email ?? '',
        age: profile.age ?? null
      });
      this.form.enable();
      this.hasProfile.set(true);
    } catch (error) {
      this.errorMessage.set(mapProfileError(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting() || this.isDeleting()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.token || !this.userId) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.disable();

    try {
      const rawValue = this.form.getRawValue();
      const payload: UpdateUserRequest = {
        name: rawValue.name.trim(),
        email: rawValue.email.trim(),
        age: rawValue.age ?? 0
      };

      const response = await firstValueFrom(
        this.profileService.updateProfile(this.userId, payload, this.token)
      );

      this.form.setValue({
        name: response.name ?? payload.name,
        email: response.email ?? payload.email,
        age: response.age ?? payload.age
      });
      this.successMessage.set('Profilo aggiornato con successo.');
    } catch (error) {
      this.errorMessage.set(mapProfileError(error));
    } finally {
      this.isSubmitting.set(false);
      this.form.enable();
    }
  }

  async onDeleteAccount(): Promise<void> {
    if (this.isLoading() || this.isSubmitting() || this.isDeleting()) {
      return;
    }

    if (!this.token || !this.userId) {
      await this.router.navigate(['/login']);
      return;
    }

    const confirmed = window.confirm(
      "Confermi l'eliminazione definitiva del tuo account? Questa azione non puo essere annullata."
    );

    if (!confirmed) {
      return;
    }

    let hasDeleted = false;

    this.isDeleting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.disable();

    try {
      await firstValueFrom(this.profileService.deleteProfile(this.userId, this.token));
      hasDeleted = true;
      this.authStorage.clearSession();
      await this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage.set(mapProfileError(error));
    } finally {
      this.isDeleting.set(false);

      if (!hasDeleted) {
        this.form.enable();
      }
    }
  }
}

function mapProfileError(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'Impossibile connettersi al server. Riprova più tardi.';
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 404) {
      return 'Profilo non trovato.';
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
