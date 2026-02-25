import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService?: AuthService;

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip if Authorization header already exists (prevents circular dependency during init)
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // Skip token exchange endpoint
    if (req.url.includes('/api/login') && req.method === 'POST') {
      return next.handle(req);
    }

    // Lazy-load AuthService to avoid circular dependency
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }

    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}


