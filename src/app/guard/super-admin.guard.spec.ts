import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenSuperAdminGuard } from './super-admin.guard';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TokenSuperAdminGuard', () => {
  let guard: TokenSuperAdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getRoles']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TokenSuperAdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
    });

    guard = TestBed.inject(TokenSuperAdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if user is authenticated and role is ADMIN', () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('ADMIN');

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBe(true);
  });

  it('should deny access and navigate to /homeAdmin if user is not ADMIN', () => {
    authService.isAuthenticated.and.returnValue(true);
    userService.getRoles.and.returnValue('USER');

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBe(false);
    expect(alertService.showMessage).toHaveBeenCalledWith('error', 'Erro', 'Você não possui acesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/homeAdmin']);
  });

  it('should deny access and navigate to /loginsocial if user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate({} as any, { url: '/someUrl' } as any);

    expect(result).toBe(false);
    expect(alertService.showMessage).toHaveBeenCalledWith('error', 'Erro', 'Você não está logado!');
    expect(router.navigate).toHaveBeenCalledWith(['/loginsocial'], { queryParams: { returnUrl: '/someUrl' } });
  });
});

