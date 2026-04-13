export interface User {
  username: string;
  email: string;
  createdAt?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiration: string;
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}


