import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { TokenRequest, TokenResponse, GitHubUser, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'github_token';
  private readonly REDIRECT_KEY = 'redirect_url';
  private readonly apiUrl = '/api/login';
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token) {
      // Set authenticated immediately, then fetch user profile
      this.authStateSubject.next({
        isAuthenticated: true,
        user: null,
        token: token
      });
      
      this.fetchUserProfile(token).subscribe({
        error: () => this.clearAuth()
      });
    }
  }

  setRedirectUrl(url: string): void {
    sessionStorage.setItem(this.REDIRECT_KEY, url);
  }

  getRedirectUrl(): string {
    const url = sessionStorage.getItem(this.REDIRECT_KEY) || '/';
    sessionStorage.removeItem(this.REDIRECT_KEY);
    return url;
  }

  requestAccessToken(code: string): Observable<TokenResponse> {
    const request: TokenRequest = { code };
    return this.http.post<TokenResponse>(this.apiUrl, request);
  }

  setToken(token: string): void {
    this.storeToken(token);
    this.authStateSubject.next({
      isAuthenticated: true,
      user: null,
      token: token
    });
    
    // Fetch user profile in background
    this.fetchUserProfile(token).subscribe();
  }

  private fetchUserProfile(token: string): Observable<GitHubUser> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<GitHubUser>(`${this.apiUrl}/user`, { headers }).pipe(
      tap(user => {
        this.authStateSubject.next({
          isAuthenticated: true,
          user: user,
          token: token
        });
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of({} as GitHubUser);
      })
    );
  }

  logout(): void {
    this.clearAuth();
  }

  private clearAuth(): void {
    this.removeStoredToken();
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): GitHubUser | null {
    return this.authStateSubject.value.user;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private removeStoredToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

