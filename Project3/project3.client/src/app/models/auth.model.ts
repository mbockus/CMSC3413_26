export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

export interface TokenRequest {
  code: string;
  client_id?: string;
  client_secret?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  token: string | null;
}

