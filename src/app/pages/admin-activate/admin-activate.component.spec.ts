import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminActivateComponent } from './admin-activate.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

type ErrorResponseType = HttpErrorResponse;

describe('AdminActivateComponent', () => {
  let component: AdminActivateComponent;
  let fixture: ComponentFixture<AdminActivateComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['setupAdmin']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['errorMessage', 'showMessage']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminActivateComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ email: 'test@unb.br' }) } },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertService, useValue: alertSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminActivateComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar setupAdmin se o email for fornecido em queryParams', () => {
    authServiceSpy.setupAdmin.and.returnValue(of({}));
    fixture.detectChanges();
    expect(authServiceSpy.setupAdmin).toHaveBeenCalledWith({ email: 'test@unb.br' });
  });

  it('deve navegar para /loginsocial se o email não for fornecido', () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { queryParams: of({}) } });
    fixture = TestBed.createComponent(AdminActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(alertServiceSpy.errorMessage).toHaveBeenCalledWith({ message: 'Email não fornecido' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loginsocial']);
  });

  it('deve mostrar mensagem de sucesso e navegar para /homeAdmin ao configurar admin com sucesso', () => {
    authServiceSpy.setupAdmin.and.returnValue(of({}));
    fixture.detectChanges();
    expect(alertServiceSpy.showMessage).toHaveBeenCalledWith('success', 'Sucesso', 'Admin configurado com sucesso!');
    expect(alertServiceSpy.showMessage).toHaveBeenCalledWith('info', 'Alerta', 'Saia da sua conta e entre novamente para acessar a tela de administrador.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/homeAdmin']);
  });

  it('deve mostrar mensagem de erro e navegar para /loginsocial em caso de erro ao configurar admin', () => {
    const errorResponse = new HttpErrorResponse({ error: { detail: 'Erro desconhecido' }, status: 500 });
    authServiceSpy.setupAdmin.and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect(alertServiceSpy.errorMessage).toHaveBeenCalledWith({ message: 'Erro desconhecido' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loginsocial']);
  });
});
