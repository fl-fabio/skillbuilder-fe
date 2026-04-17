import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { hasValidAuthToken } from './auth.guard';
import { AuthStorageService } from '../services/auth-storage.service';

export const guestGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (hasValidAuthToken(authStorage)) {
    return router.createUrlTree(['/profile']);
  }

  return true;
};
