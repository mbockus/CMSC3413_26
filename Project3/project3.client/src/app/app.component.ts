import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthState } from './models/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Pokémon Explorer';
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.authState = state;
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
