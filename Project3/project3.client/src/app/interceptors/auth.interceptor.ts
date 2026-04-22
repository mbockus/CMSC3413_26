import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    // Skip if Authorization header already exists (prevents circular dependency during init)
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // Skip auth endpoints
    if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
      return next.handle(req);
    }

    // Use inject() to get AuthService - this avoids circular dependency
    // and works correctly in production builds with tree-shaking
    const authService = inject(AuthService);
    const token = authService.getToken();

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
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}



