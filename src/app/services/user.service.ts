import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, UserFormValue } from '../models/user.model';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly api = inject(UsersApiService);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedUserId = signal<number | null>(null);

  async getUsers(): Promise<User[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      return await firstValueFrom(this.api.getUsers());
    } catch (error) {
      this.error.set('Errore durante il caricamento utenti.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getUserById(id: number): Promise<User> {
    this.isLoading.set(true);
    this.error.set(null);
    this.selectedUserId.set(id);

    try {
      return await firstValueFrom(this.api.getUserById(id));
    } catch (error) {
      this.error.set('Errore durante il caricamento utente.');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateUser(id: number, formValue: UserFormValue): Promise<User> {
    this.isSaving.set(true);
    this.error.set(null);
    this.selectedUserId.set(id);

    try {
      return await firstValueFrom(
        this.api.updateUser(id, this.mapFormToPayload(formValue))
      );
    } catch (error) {
      this.error.set('Errore durante il salvataggio utente.');
      throw error;
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteUser(id: number): Promise<void> {
    this.isDeleting.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteUser(id));
    } catch (error) {
      this.error.set('Errore durante l’eliminazione utente.');
      throw error;
    } finally {
      this.isDeleting.set(false);
    }
  }

  private mapFormToPayload(formValue: UserFormValue): Partial<User> {
    return {
      name: formValue.name,
      username: formValue.username,
      email: formValue.email,
      phone: formValue.phone,
      website: formValue.website,
      address: {
        street: formValue.street,
        suite: '',
        city: formValue.city,
        zipcode: '',
        geo: {
          lat: '0',
          lng: '0'
        }
      },
      company: {
        name: formValue.companyName,
        catchPhrase: '',
        bs: ''
      }
    };
  }
}