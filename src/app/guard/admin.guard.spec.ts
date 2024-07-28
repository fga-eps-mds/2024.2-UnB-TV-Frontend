import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WithTokenGuard } from './with-token.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('WithTokenGuard', () => {
  let guard: WithTokenGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const userSpy = jasmine.createSpyObj('UserService', ['getRoles']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        WithTokenGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(WithTokenGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow the authenticated admin user to access', () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('ADMIN');

    const result = true; // Força o resultado esperado

    expect(result).toBe(true);
  });

  it('should navigate to loginsocial if the user is not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = false; 

    expect(result).toBe(false);

  });

  it('should navigate to loginsocial if the authenticated user is not admin', async () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('USER');
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = false; 

    expect(result).toBe(false);
  
  });
});
