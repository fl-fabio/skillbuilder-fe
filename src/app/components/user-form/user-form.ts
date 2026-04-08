import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserFormValue } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private readonly fb = inject(FormBuilder);

  initialUser = input<User | null>(null);
  submitLabel = input('Save changes');
  loading = input(false);

  formSubmitted = output<UserFormValue>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
    city: [''],
    street: [''],
    companyName: ['']
  });

  constructor() {
    effect(() => {
      const user = this.initialUser();

      if (!user) {
        return;
      }

      this.form.patchValue({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        city: user.address?.city ?? '',
        street: user.address?.street ?? '',
        companyName: user.company?.name ?? ''
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitted.emit(this.form.getRawValue());
  }
}
