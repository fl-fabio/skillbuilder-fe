import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  user_id?: string;
}

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<JwtPayload>(token);

  if (decoded.sub) {
    return decoded.sub;
  }

  if (decoded.user_id) {
    return decoded.user_id;
  }

  throw new Error('User ID not found in token');
}