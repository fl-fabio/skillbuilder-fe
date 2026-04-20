import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { getUserIdFromToken } from '../../../core/utils/jwt.utils';
import { PrivacyLevel, UpdateUserRequest } from '../../models/profile.models';
import { ProfileService } from '../../services/profile.service';

type ProfileForm = FormGroup<{
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  privacyLevel: FormControl<PrivacyLevel | ''>;
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
  readonly privacyOptions: ReadonlyArray<{ value: PrivacyLevel; label: string }> = [
    { value: '1', label: 'Livello 1' },
    { value: '2', label: 'Livello 2' }
  ];
  readonly form: ProfileForm = new FormGroup({
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
    privacyLevel: new FormControl<PrivacyLevel | ''>('', {
      nonNullable: true,
      validators: [Validators.required]
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

  get surnameControl(): FormControl<string> {
    return this.form.controls.surname;
  }

  get privacyLevelControl(): FormControl<PrivacyLevel | ''> {
    return this.form.controls.privacyLevel;
  }

  async ngOnInit(): Promise<void> {
    this.token = this.authStorage.getToken();

    if (!this.token) {
      await this.router.navigate(['/login']);
      return;
    }

    await this.loadProfile();
  }

  async onRetryLoad(): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    if (!this.token) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isLoading.set(true);
    this.hasProfile.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.disable();

    try {
      const userId = (this.userId ?? getUserIdFromToken(this.token)).trim();

      if (!userId) {
        this.errorMessage.set('Errore di autenticazione. Effettua nuovamente il login.');
        return;
      }

      this.userId = userId;

      const profile = await firstValueFrom(this.profileService.getUserProfile(userId));

      this.form.reset({
        name: profile.name ?? '',
        surname: profile.surname ?? '',
        email: profile.email ?? '',
        privacyLevel: profile.privacy_level ?? ''
      });
      this.form.enable();
      this.hasProfile.set(true);
    } catch (error) {
      console.error('Failed to load profile:', error);

      if (error instanceof Error && error.message === 'User ID not found in token') {
        this.errorMessage.set('Errore di autenticazione. Effettua nuovamente il login.');
      } else {
        this.errorMessage.set(LOAD_PROFILE_ERROR_MESSAGE);
      }
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
      const privacyLevel = rawValue.privacyLevel;

      if (!isPrivacyLevel(privacyLevel)) {
        this.errorMessage.set('Seleziona un livello privacy valido.');
        this.form.enable();
        this.isSubmitting.set(false);
        return;
      }

      const payload: UpdateUserRequest = {
        name: rawValue.name.trim(),
        surname: rawValue.surname.trim(),
        email: rawValue.email.trim(),
        privacy_level: privacyLevel
      };

      const response = await firstValueFrom(
        this.profileService.updateProfile(this.userId, payload, this.token)
      );

      this.form.setValue({
        name: response.name ?? payload.name,
        surname: response.surname ?? payload.surname,
        email: response.email ?? payload.email,
        privacyLevel: response.privacy_level ?? payload.privacy_level
      });
      this.successMessage.set('Profilo aggiornato con successo.');
    } catch (error) {
      console.error('Failed to update profile:', error);
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
      console.error('Failed to delete profile:', error);
      this.errorMessage.set(mapProfileError(error));
    } finally {
      this.isDeleting.set(false);

      if (!hasDeleted) {
        this.form.enable();
      }
    }
  }
}

const LOAD_PROFILE_ERROR_MESSAGE = 'Non è stato possibile caricare il profilo. Riprova più tardi.';

function mapProfileError(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'Server lento o non raggiungibile';
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 404) {
      return 'Profilo non trovato';
    }

    if (error.status === 0) {
      return 'Errore di connessione';
    }
  }

  return 'Si è verificato un errore. Riprova.';
}

function isPrivacyLevel(value: string): value is PrivacyLevel {
  return value === '1' || value === '2';
}
