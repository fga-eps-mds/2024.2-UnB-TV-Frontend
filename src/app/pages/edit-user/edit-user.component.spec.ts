import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProfileComponent } from '../profile/profile.component';
import { AlertService } from 'src/app/services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { IError } from 'src/shared/model/http-error.model'

const mockData: any = {
  name: "Mario",
  email: "mario@gmail.com",
  connection: "ALUNO",
};

const mockError: IError = { detail: 'An error occurred' };

class UserServiceMock {
  updateUser() {
    return of({ success: true });
  }
  getUser() {
    return of(mockData);
  }
  getVinculo() {
    return of(['ALUNO', 'PROFESSOR']);
  }
}

class AlertServiceMock {
  errorMessage() {}
  showMessage() {}
}

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let userService: UserService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'profile', component: ProfileComponent },
        ]),
        ReactiveFormsModule,
        DropdownModule
      ],
      declarations: [EditUserComponent],
      providers: [
        { provide: UserService, useValue: new UserServiceMock() },
        { provide: AlertService, useValue: new AlertServiceMock() },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser and handle success response', () => {
    spyOn(userService, 'getUser').and.returnValue(of(mockData));
    spyOn(component, 'initializeForm').and.callThrough();
    component.getUser();
    expect(component.userData).toEqual(mockData);
    expect(component.initializeForm).toHaveBeenCalled();
  });
  
  it('should call getVinculo and handle success response', () => {
    spyOn(userService, 'getVinculo').and.returnValue(of(['ALUNO', 'PROFESSOR']));
    component.getVinculo();
    expect(component.vinculo).toEqual([
      { name: 'ALUNO' },
      { name: 'PROFESSOR' }
    ]);
  });

  it('should call updateUser method when the form is valid and submitted', () => {
    spyOn(component, 'updateUser').and.callThrough();
    spyOn(userService, 'updateUser').and.returnValue(of({ success: true }));
    spyOn(alertService, 'showMessage');
    const form = component.userForm;
    form.setValue(mockData);
    component.userId = 1;

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.updateUser).toHaveBeenCalled();
    expect(alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Usuário atualizado com sucesso!'
    );
  });
});