import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail-page',
  imports: [RouterLink],
  templateUrl: './user-detail-page.html',
  styleUrl: './user-detail-page.scss',
})
export class UserDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);

  readonly user = signal<User | null>(null);

  get isLoading() {
    return this.usersService.isLoading;
  }

  get error() {
    return this.usersService.error;
  }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(id)) {
      return;
    }

    try {
      const user = await this.usersService.getUserById(id);
      this.user.set(user);
    } catch (error) {
      console.error(error);
    }
  }
}
