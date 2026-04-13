import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, ErrorResponse, AuthState, User } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REDIRECT_KEY = 'redirect_url';
  private readonly apiUrl = '/api/auth';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.authStateSubject.next({
        isAuthenticated: true,
        user: user,
        token: token
      });

      // Verify token is still valid
      this.getCurrentUser().subscribe({
        error: () => this.clearAuth()
      });
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        const currentState = this.authStateSubject.value;
        this.authStateSubject.next({
          ...currentState,
          user: user
        });
        this.storeUser(user);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const user: User = {
      username: response.username,
      email: response.email
    };

    this.storeToken(response.token);
    this.storeUser(user);

    this.authStateSubject.next({
      isAuthenticated: true,
      user: user,
      token: response.token
    });
  }

  private clearAuth(): void {
    this.removeStoredToken();
    this.removeStoredUser();
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }

  setRedirectUrl(url: string): void {
    sessionStorage.setItem(this.REDIRECT_KEY, url);
  }

  getRedirectUrl(): string {
    const url = sessionStorage.getItem(this.REDIRECT_KEY) || '/';
    sessionStorage.removeItem(this.REDIRECT_KEY);
    return url;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getUser(): User | null {
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

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private removeStoredUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}


