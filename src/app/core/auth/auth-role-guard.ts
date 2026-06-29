import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authRoleGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

   if (!authService.isLoaded()) {
    authService.loadCurrentUser();
  }


  const user = authService.currentUser();

//  console.log('Guard User:', user);


  if (!user) {
    router.navigate(['/login']);
    return false;
  }


  if (user.role === 'ADMIN') {
    return true;
  }


  router.navigate(['/vms']);
  return false;
}