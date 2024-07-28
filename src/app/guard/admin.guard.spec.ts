import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WithTokenGuard } from './with-token.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('WithTokenGuard', () => {
  let guard: WithTokenGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        WithTokenGuard,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    guard = TestBed.inject(WithTokenGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for unauthenticated user', () => {
    authService.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate()).toBe(true);
  });

  it('should navigate to /catalog for authenticated user', () => {
    authService.isAuthenticated.and.returnValue(true);
    spyOn(router, 'navigate');
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });
});

