import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';

import { environment } from '../../environments/environments';
import { LoginRequest } from '../../models/login.request';
import { AccessToken } from '../../models/access.token';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../../models/UserProfile';

@Service()
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private readonly http = inject(HttpClient);

  readonly token = signal<string | null>(this.getToken());
  readonly isAuthenticated = computed(() => !!this.token());
  private  user = signal<UserProfile | null>(null);
  private loaded = signal(false);

  login(credentials: LoginRequest): Observable<AccessToken> {
    return this.http.post<AccessToken>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, res.data.accessToken);

        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.data.refreshToken);

        this.token.set(res.data.accessToken);
      }),
    );
  }

  refresh(): Observable<AccessToken> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    return this.http
      .post<AccessToken>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, res.data.accessToken);

          localStorage.setItem(this.REFRESH_TOKEN_KEY, res.data.refreshToken);

          this.token.set(res.data.accessToken);
        }),
      );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    return this.http
      .post(`${environment.apiUrl}/auth/logout`, {
        refreshToken,
      })
      .pipe(
        tap(() => {
          localStorage.removeItem(this.ACCESS_TOKEN_KEY);

          localStorage.removeItem(this.REFRESH_TOKEN_KEY);

          this.token.set(null);
        }),
      );
  }

  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/auth/me`);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

   currentUser() {
    return this.user();
  }

  isLoaded() {
    return this.loaded();
  }


  loadCurrentUser(): void {

    this.getMe().subscribe({
      next: (res) => {
        console.log('User data received:', res);

        this.user.set(res);
        this.loaded.set(true);
      },
      error: () => {
        this.user.set(null);
        this.loaded.set(true);
      }
    });

  }
}
