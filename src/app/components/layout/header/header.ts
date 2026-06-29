import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UserProfile } from '../../../models/UserProfile';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  private user = signal<UserProfile | null>(null);
  private loaded = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCurrentUser();
  }


  get currentUser() {
    return this.user();
  }


  isLoaded(): boolean {
    return this.loaded();
  }


  loadCurrentUser(): void {

    this.authService.getMe().subscribe({

      next: (res: UserProfile) => {

        this.user.set(res);
        this.loaded.set(true);

      },

      error: () => {

        this.user.set(null);
        this.loaded.set(true);

      }

    });
  }


  logout(): void {

    this.authService.logout()
      .subscribe({

        next: () => {
          this.clearUser();
          this.router.navigateByUrl('/auth/login');
        },

        error: () => {
          this.clearUser();
          this.router.navigateByUrl('/auth/login');
        }

      });
  }


  private clearUser() {
    this.user.set(null);
    this.loaded.set(false);
  }

}