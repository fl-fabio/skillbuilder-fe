export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserInformation {
  user_id: string;
  email: string;
}

export type RegisterPrivacyLevel = '1' | '2';

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  privacy_level: RegisterPrivacyLevel;
}

export interface RegisterResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  privacy_level: RegisterPrivacyLevel;
  accepted_at?: string | null;
}
