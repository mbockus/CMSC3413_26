import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { TokenResponse } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUrl!: string;
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Construct GitHub OAuth URL
    const redirectUri = `${window.location.origin}/login`;
    this.loginUrl = `https://github.com/login/oauth/authorize?client_id=${environment.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Check if we're returning from GitHub with a code
    const code = this.route.snapshot.queryParamMap.get('code');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    
    if (code) {
      this.loading = true;
      this.authService.requestAccessToken(code).subscribe({
        next: (tokenResponse: TokenResponse) => {
          this.authService.setToken(tokenResponse.access_token);
          const destination = returnUrl || this.authService.getRedirectUrl();
          this.router.navigateByUrl(destination);
        },
        error: (err) => {
          console.error('Token exchange error:', err);
          this.error = 'Failed to authenticate. Please try again.';
          this.loading = false;
          // Remove code from URL
          this.router.navigate(['/login'], { 
            queryParams: returnUrl ? { returnUrl } : {} 
          });
        }
      });
    } else {
      // Store return URL if provided
      if (returnUrl) {
        this.authService.setRedirectUrl(returnUrl);
      }
    }
  }

  login(): void {
    window.location.href = this.loginUrl;
  }
}

