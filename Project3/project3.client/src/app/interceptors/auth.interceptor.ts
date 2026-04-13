import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService?: AuthService;
  private router?: Router;

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    // Skip if Authorization header already exists (prevents circular dependency during init)
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // Skip auth endpoints
    if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
      return next.handle(req);
    }

    // Lazy-load services to avoid circular dependency
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    if (!this.router) {
      this.router = this.injector.get(Router);
    }

    const token = this.authService.getToken();

    let clonedReq = req;
    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - clear auth and redirect to login
          this.authService?.logout();
        }
        return throwError(() => error);
      })
    );
  }
}



