import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { AuthStorageService } from '../services/auth-storage.service';

type AuthJwtPayload = JwtPayload;

function createLoginRedirect(
  authStorage: AuthStorageService,
  router: Router
): UrlTree {
  authStorage.clearSession();

  return router.createUrlTree(['/login']);
}

export function hasValidAuthToken(authStorage: AuthStorageService): boolean {
  const token = authStorage.getToken();

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<AuthJwtPayload>(token);

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      authStorage.clearSession();
      return false;
    }

    return true;
  } catch {
    authStorage.clearSession();
    return false;
  }
}

export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (hasValidAuthToken(authStorage)) {
    return true;
  }

  return createLoginRedirect(authStorage, router);
};
