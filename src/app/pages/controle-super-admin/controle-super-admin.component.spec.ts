import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControleSuperAdminComponent } from './controle-super-admin.component';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VideoService } from 'src/app/services/video.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Confirmation } from 'primeng/api';

class UserServiceMock {
  getAllUsers() {
    return of({
      body: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]
    });
  }

  deleteUser(userId: number) {
    // Simulate successful user deletion
    return of(null);
  }

  updateUserRoleSuperAdmin(id: number, role: string) {
    if (role === 'ADMIN' && !['User 1', 'User 2'].includes('unb')) {
      return throwError(() => new HttpErrorResponse({ status: 400, statusText: "Usuário não pode receber essa role" }));
    }
    return of({});
  }
}

class AlertServiceMock {
  showMessage(type: string, title: string, message: string) {
    console.log(`[AlertService] ${type.toUpperCase()}: ${title} - ${message}`);
  }

  errorMessage(error: any) {
    console.error(`[AlertService] ERROR: ${error.status} - ${error.statusText}`);
  }
}

class ConfirmationServiceMock {
  confirm(options: any) {
    if (options.accept) {
      console.log("[ConfirmationService] User accepted the confirmation.");
      options.accept();
    } else if (options.reject) {
      console.log("[ConfirmationService] User rejected the confirmation.");
      options.reject();
    }
  }
}

class AuthServiceMock {
  logout() {
    console.log("[AuthService] User logged out.");
  }
}

describe('ControleSuperAdminComponent', () => {
  let component: ControleSuperAdminComponent;
  let fixture: ComponentFixture<ControleSuperAdminComponent>;
  let userService: UserService;
  let alertService: AlertService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControleSuperAdminComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: ConfirmationService, useClass: ConfirmationServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: VideoService, useClass: VideoService },
        MessageService,
        Router
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleSuperAdminComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    spyOn(userService, 'getAllUsers').and.callThrough();
    component.ngOnInit();
    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should handle error when loading users fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Erro de rede',
      status: 500,
      statusText: 'Erro Interno do Servidor'
    });
    spyOn(userService, 'getAllUsers').and.returnValue(throwError(() => errorResponse));
    spyOn(alertService, 'errorMessage').and.callThrough();
    component.loadUsers();
    expect(alertService.errorMessage).toHaveBeenCalledWith(errorResponse);
    expect(component.loading).toBeFalse();
  });

  it('should delete a user and reload users', () => {
    spyOn(userService, 'deleteUser').and.callThrough();
    spyOn(component, 'loadUsers').and.callThrough();
    component.deleteUser(1);
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('should handle error when deleting user fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Erro de rede',
      status: 500,
      statusText: 'Erro Interno do Servidor'
    });
    spyOn(userService, 'deleteUser').and.returnValue(throwError(() => errorResponse));
    spyOn(alertService, 'errorMessage').and.callThrough();
    component.deleteUser(1);
    expect(alertService.errorMessage).toHaveBeenCalledWith(errorResponse);
  });

  it('should confirm logout', () => {
    spyOn(confirmationService, 'confirm').and.callThrough();
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'logout').and.callThrough();

    component.logoutUser();

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not logout if reject is called', () => {
    spyOn(confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.reject) {
        confirmation.reject();
      }
      return confirmationService; // Retorna o próprio serviço para respeitar o tipo esperado
    });
  
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'logout').and.callThrough();
  
    component.logoutUser();
  
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('should update user role successfully', () => {
    const userId = 1;
    const role = 'ADMIN';
    spyOn(userService, 'updateUserRoleSuperAdmin').and.returnValue(of({}));
    spyOn(alertService, 'showMessage').and.callThrough();

    component.updateUserRole(userId, role);

    expect(userService.updateUserRoleSuperAdmin).toHaveBeenCalledWith(userId, role);
    expect(alertService.showMessage).not.toHaveBeenCalledWith('error', 'Erro', "Usuário não pode receber essa role, por não ter 'unb' no email");
  });

  it('should handle error when updating user role fails', () => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: "Usuário não pode receber essa role"
    });
    spyOn(userService, 'updateUserRoleSuperAdmin').and.returnValue(throwError(() => errorResponse));
    spyOn(alertService, 'showMessage').and.callThrough();
    component.updateUserRole(1, 'ADMIN');
    expect(alertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      "Usuário não pode receber essa role, por não ter 'unb' no email"
    );
  });

  it('should handle role change event', () => {
    spyOn(component, 'updateUserRole').and.callThrough();
    const event = { target: { value: 'ADMIN' } } as unknown as Event;
    component.onRoleChange(1, event);
    expect(component.updateUserRole).toHaveBeenCalledWith(1, 'ADMIN');
  });
});