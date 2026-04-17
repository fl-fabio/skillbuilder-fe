import { JwtPayload, jwtDecode } from 'jwt-decode';

type AppJwtPayload = JwtPayload & {
  user_id?: string | number;
  sub?: string | number;
};

export function getUserIdFromToken(token: string): string {
  const decoded = jwtDecode<AppJwtPayload>(token);

  if (decoded.user_id !== undefined && decoded.user_id !== null) {
    return String(decoded.user_id);
  }

  if (decoded.sub !== undefined && decoded.sub !== null) {
    return String(decoded.sub);
  }

  throw new Error('User ID not found in token');
}
