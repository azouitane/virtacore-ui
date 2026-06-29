import { Component, inject, OnInit, signal } from '@angular/core'; // 1. Ajoute 'signal'
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../models/UserProfile';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);

  // 2. Déclare le profil comme un Signal
  user = signal<UserProfile | undefined>(undefined);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getMe().subscribe({
      next: (res) => {
        console.log('User data received:', res);
        this.user.set(res); // 3. Mets à jour le signal ici
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      }
    });
  }
}
