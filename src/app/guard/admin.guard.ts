import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class TokenAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.userService.getRoles();

      if (userRole === 'ADMIN' || userRole === 'COADMIN') {
        return true;
      } else {
        this.router.navigate(['/loginsocial']);
        return false;
      }
    } else {
      this.router.navigate(['/loginsocial'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}