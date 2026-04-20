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

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  privacy_level: number;
}

export interface RegisterResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  privacy_level: number;
}
