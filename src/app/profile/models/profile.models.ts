export type PrivacyLevel = '1' | '2';

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  privacy_level: PrivacyLevel;
  accepted_at?: string | null;
}

export interface UpdateUserRequest {
  name: string;
  surname: string;
  email: string;
  privacy_level: PrivacyLevel;
}

export interface UpdateUserResponse extends UserProfile {
  message?: string;
}

export interface DeleteUserResponse {
  message?: string;
}
