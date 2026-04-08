import { Component, input, output } from '@angular/core';
import { User } from '../../models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  user = input.required<User>();
  deleteRequested = output<number>();

  onDelete() {
    this.deleteRequested.emit(this.user().id);
  }
}
