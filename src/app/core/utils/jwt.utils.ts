import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  sub?: string;
  user_id?: string;
  email?: string;
}

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<CustomJwtPayload>(token);

  if (decoded?.user_id) {
    return String(decoded.user_id);
  }

  if (decoded?.sub) {
    return String(decoded.sub);
  }

  throw new Error('User ID not found in token');
}

export function getEmailFromToken(token: string): string | null {
  const decoded = jwtDecode<CustomJwtPayload>(token);
  return decoded?.email ?? null;
}
