import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAdminComponent } from './home-admin.component';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/video.service';
import { ConfirmationService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'

class ConfirmationServiceMock {
  confirm() { }
}

describe('HomeAdminComponent', () => {
  let component: HomeAdminComponent;
  let fixture: ComponentFixture<HomeAdminComponent>;
  let authService: AuthService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    confirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [HomeAdminComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      providers: [AuthService, VideoService, ConfirmationService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAdminComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    confirmationService = TestBed.inject(ConfirmationService);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirm of confirmationService when logout is clicked', () => {
    spyOn(component, 'logoutUser').and.callThrough();
    const mySpy = spyOn(confirmationService, 'confirm');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '.linkLogout'
    );

    submitButton.click();
    expect(mySpy).toHaveBeenCalled();
  });
}); 
