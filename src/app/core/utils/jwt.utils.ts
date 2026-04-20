import { jwtDecode } from 'jwt-decode';

interface AuthTokenPayload {
  sub?: string | number;
  user_id?: string | number;
}

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<AuthTokenPayload>(token);

  if (decoded?.sub) {
    return String(decoded.sub);
  }

  if (decoded?.user_id) {
    return String(decoded.user_id);
  }

  throw new Error('User ID not found in token');
}
