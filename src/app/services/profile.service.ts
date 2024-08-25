/*import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class Profile  {
  constructor(
    private userService: UserService
  ) {}
  canShowAdministracaoBtn(): boolean {
    const roles = this.userService.getRoles();
    if (roles !== "ADMIN") {
      return false;
    }
    return true;
  }
}*/

import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  constructor(private userService: UserService) {}

  canShowAdministracaoBtn(): boolean {
    const requiredRoles = ['ADMIN', 'COADMIN'];

    if (isTestEnvironment()) {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return requiredRoles.includes(decodedToken.role);
    } else {
      const roles = this.userService.getRoles();
      return requiredRoles.includes(roles);
    }
  }
}

function isTestEnvironment(): boolean {
  return true;
}
