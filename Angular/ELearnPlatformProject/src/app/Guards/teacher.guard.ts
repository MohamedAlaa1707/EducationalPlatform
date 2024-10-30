import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuthService } from '../Services/User/user-auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const teacherGuard: CanActivateFn = (route, state: RouterStateSnapshot) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);


  if (typeof localStorage === 'undefined') {
    router.navigate(['/Login']);
    return of(false);
  }

  return authService.ISExpired().pipe(
    map((response) => {
      if (response.role && response.role.toUpperCase() === 'T') {
        return true;
      } else {
        router.navigate(['/Login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/Login']);
      return of(false);
    })
  );
};
