import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<any>(token);

  console.log('JWT decoded payload:', decoded);

  if (decoded?.sub) {
    return String(decoded.sub);
  }

  if (decoded?.user_id) {
    return String(decoded.user_id);
  }

  throw new Error('User ID not found in token');
}

export function getEmailFromToken(token: string): string | null {
  const decoded = jwtDecode<any>(token);

  return decoded?.email ?? null;
}