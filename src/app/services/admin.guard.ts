import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  
  canActivate(): boolean {
    const roles = this.userService.getRoles();
    if (roles !== "ADMIN") {
      this.router.navigate(["/"]);
      return false;
    }
    return true;
  }
  
}
