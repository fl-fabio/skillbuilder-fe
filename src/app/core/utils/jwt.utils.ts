import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken(token: string): string {
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.user_id || '';
  } catch (error) {
    console.error('Error decoding user_id:', error);
    return '';
  }
}

export function getEmailFromToken(token: string): string {
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.email || '';
  } catch (error) {
    console.error('Error decoding email:', error);
    return '';
  }
}
