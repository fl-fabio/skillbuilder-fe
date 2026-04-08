import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserCard } from "../../components/user-card/user-card";

@Component({
  selector: 'app-users-home-page',
  imports: [UserCard],
  templateUrl: './users-home-page.html',
  styleUrl: './users-home-page.scss',
  standalone: true
})
export class UsersHomePage implements OnInit{

  private readonly usersService = inject(UsersService);
  readonly users = signal<User[]>([]);
  readonly query = signal('');

  readonly filteredUsers = computed(() => {
    const term = this.query().trim().toLowerCase();

    if (!term) {
      return this.users();
    }

    return this.users().filter((user) => {
      const content = [
        user.name,
        user.username,
        user.email,
        user.address?.city,
        user.company?.name
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return content.includes(term);
    });
  });

  get isLoading() {
    return this.usersService.isLoading;
  }

  get error() {
    return this.usersService.error;
  }

  async ngOnInit(): Promise<void> {
    try {
      const users = await this.usersService.getUsers();
      this.users.set(users);
    } catch (error) {
      console.error(error);
    }
  }

  onSearch(value: string): void {
    this.query.set(value);
  }

  async onDelete(id: number): Promise<void> {
    const confirmed = window.confirm(`Eliminare l'utente ${id}?`);
    if (!confirmed) {
      return;
    }

    try {
      await this.usersService.deleteUser(id);
      this.users.update((current) => current.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  }


}
