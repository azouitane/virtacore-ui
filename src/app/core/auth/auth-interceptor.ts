import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  const token = authService.token();


  if (token) {
    req = addToken(req, token);
  }


  return next(req).pipe(

    catchError((err: HttpErrorResponse) => {


      if (err.status === 401) {

        return authService.refresh().pipe(

          switchMap(() => {

            const newToken = authService.token();

            if (newToken) {
              return next(addToken(req, newToken));
            }

            return throwError(() => err);
          }),


          catchError(refreshError => {

            authService.logout().subscribe();

            router.navigateByUrl('/auth/login');

            return throwError(() => refreshError);
          })

        );

      }


      return throwError(() => err);

    })

  );

};



function addToken(req: any, token: string) {

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

}