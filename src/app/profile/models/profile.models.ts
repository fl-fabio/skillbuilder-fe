export interface UserProfile {
  id?: string | number;
  user_id?: string | number;
  name: string;
  email: string;
  age: number | null;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserResponse extends UserProfile {
  message?: string;
}

export interface DeleteUserResponse {
  message?: string;
}
