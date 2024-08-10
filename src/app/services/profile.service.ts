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
  providedIn: 'root'
})
export class Profile {
  constructor(private userService: UserService) {}

  canShowAdministracaoBtn(): boolean {
    if (isTestEnvironment()) {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role === "ADMIN";
    } else {
      const roles = this.userService.getRoles();
      return roles === "ADMIN";
    }
  }
}

function isTestEnvironment(): boolean {
  return true;
  //return typeof jasmine !== 'undefined';
}


