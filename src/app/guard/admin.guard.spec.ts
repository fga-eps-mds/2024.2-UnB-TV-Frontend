import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenAdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('TokenAdminGuard', () => {
  let guard: TokenAdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getRoles']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TokenAdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });
    guard = TestBed.inject(TokenAdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    route = new ActivatedRouteSnapshot();
    state = { url: '/someUrl' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for authenticated admin user', () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('ADMIN');
    expect(guard.canActivate(route, state)).toBe(true);
  });

  it('should navigate to /loginsocial for authenticated non-admin user', () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('USER');
    spyOn(router, 'navigate');
    expect(guard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/loginsocial']);
  });

  it('should navigate to /loginsocial with returnUrl for unauthenticated user', () => {
    authService.isAuthenticated.and.returnValue(false);
    spyOn(router, 'navigate');
    expect(guard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/loginsocial'], { queryParams: { returnUrl: state.url } });
  });
});

