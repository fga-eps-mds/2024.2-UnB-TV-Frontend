import { CanActivateFn } from '@angular/router';

export const superAdminGuard: CanActivateFn = (route, state) => {
  return true;
};
