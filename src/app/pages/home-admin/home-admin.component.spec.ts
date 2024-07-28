import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAdminComponent } from './home-admin.component';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/video.service';
import { ConfirmationService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeAdminComponent', () => {
  let component: HomeAdminComponent;
  let fixture: ComponentFixture<HomeAdminComponent>;
  let authService: AuthService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeAdminComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
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

/*  it('should call logoutUser and confirm logout', () => {
    spyOn(confirmationService, 'confirm').and.callFake((confirm) => confirm.accept());
    spyOn(authService, 'logout').and.callThrough();

    component.logoutUser();

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  }); */
}); 
