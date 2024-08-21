import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class TokenSuperAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private userService: UserService, 
    private router: Router,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.userService.getRoles();

      if (userRole === 'ADMIN') {
        return true;
      } else {
        this.alertService.showMessage('error', 'Erro', 'Você não possui acesso!')
        this.router.navigate(['/homeAdmin']);
        return false;
      }
    } else {
      this.alertService.showMessage('error', 'Erro', 'Você não está logado!')
      this.router.navigate(['/loginsocial'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}