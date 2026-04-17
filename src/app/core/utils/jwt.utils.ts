import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  sub?: string;
  user_id?: string;
  email?: string;
}

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<CustomJwtPayload>(token);

  if (decoded.user_id !== undefined && decoded.user_id !== null) {
    return String(decoded.user_id);
  }

  if (decoded.sub !== undefined && decoded.sub !== null) {
    return String(decoded.sub);
  }

  throw new Error('User ID not found in token');
}
