import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  handleLogout() {
    this.authService.logout();
  }

  handleLogin() {
    this.authService.loginWithRedirect({ appState: { target: '/profile' } });
  }
  handleSignUp() {
    this.authService.loginWithRedirect({ screen_hint: 'signup' });
  }
}
