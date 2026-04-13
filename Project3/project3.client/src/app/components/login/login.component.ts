import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // If already authenticated, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || 
                         this.authService.getRedirectUrl();
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;

        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    });
  }
}


