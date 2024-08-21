import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminActivateComponent } from './super-admin-activate.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { of, throwError, Subscription } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';

class MockAuthService {
  super_admin_setup(data: any) {
    return of({ success: true });
  }
}

class MockAlertService {
  showMessage() {}
  errorMessage() {}
}

class MockActivatedRoute {
  queryParams = of({ email: 'test@example.com' });
}

describe('SuperAdminActivateComponent', () => {
  let component: SuperAdminActivateComponent;
  let fixture: ComponentFixture<SuperAdminActivateComponent>;
  let authService: AuthService;
  let alertService: AlertService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperAdminActivateComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertService, useClass: MockAlertService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminActivateComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setupSuperAdmin if email is provided', () => {
    spyOn(component, 'setupSuperAdmin').and.callThrough();
    spyOn(authService, 'super_admin_setup').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(component.setupSuperAdmin).toHaveBeenCalledWith('test@example.com');
    expect(authService.super_admin_setup).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/homeAdmin']);
  });

  it('should handle error if no email is provided', () => {
    (route.queryParams as any) = of({});

    spyOn(alertService, 'errorMessage').and.callThrough();
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(alertService.errorMessage).toHaveBeenCalledWith({
      message: 'Email não fornecido',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loginsocial']);
  });

  it('should show success message on successful admin setup', () => {
    spyOn(authService, 'super_admin_setup').and.returnValue(of({}));
    spyOn(alertService, 'showMessage').and.callThrough();
    spyOn(router, 'navigate');

    component.setupSuperAdmin('test@example.com');

    expect(alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Super Admin configurado com sucesso!'
    );
    expect(alertService.showMessage).toHaveBeenCalledWith(
      'info',
      'Alerta',
      'Saia da sua conta e entre novamente para acessar a tela de administrador.'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/homeAdmin']);
  });

  it('should handle error during admin setup', () => {
    spyOn(authService, 'super_admin_setup').and.returnValue(
      throwError(() => ({
        error: { detail: 'Erro desconhecido' },
      }))
    );
    spyOn(alertService, 'errorMessage').and.callThrough();
    spyOn(router, 'navigate');

    component.setupSuperAdmin('test@example.com');

    expect(alertService.errorMessage).toHaveBeenCalledWith({
      message: 'Erro desconhecido',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loginsocial']);
  });
});
