import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user';
import { NotificationService } from '../services/notification';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (!userService.isLoggedIn()) {
    router.navigate(['/auth']);
    return false;
  }

  return userService.isAdmin$.pipe(
    take(1),
    map(isAdmin => {
      if (!isAdmin) {
        notificationService.show('אין לך הרשאות מנהל', 'error');
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
