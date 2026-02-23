import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    router.navigate(['/auth']);
    return false;
  }

  return userService.isAdmin$.pipe(
    take(1),
    map(isAdmin => {
      if (!isAdmin) {
        alert('אין לך הרשאות מנהל');
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
