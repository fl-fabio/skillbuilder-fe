import { Component, inject, OnInit, signal } from '@angular/core';
import { User, UserFormValue } from '../../models/user.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-edit-page',
  imports: [UserForm, RouterLink],
  templateUrl: './user-edit-page.html',
  styleUrl: './user-edit-page.scss',
})
export class UserEditPage implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  readonly user = signal<User | null>(null);

  get isLoading() {
    return this.usersService.isLoading;
  }

  get isSaving() {
    return this.usersService.isSaving;
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

  async onSubmit(value: UserFormValue): Promise<void> {
    const currentUser = this.user();
    if (!currentUser) {
      return;
    }

    try {
      await this.usersService.updateUser(currentUser.id, value);
      await this.router.navigate(['/users', currentUser.id]);
    } catch (error) {
      console.error(error);
    }
  }

}
