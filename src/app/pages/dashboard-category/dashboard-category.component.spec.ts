import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IVideo } from 'src/shared/model/video.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { DashboardCategoryComponent } from './dashboard-category.component';

class ConfirmationServiceMock {
  confirm() { }
}

describe('DashboardCategoryComponent', () => {
  let component: DashboardCategoryComponent;
  let fixture: ComponentFixture<DashboardCategoryComponent>;
  let videoService: VideoService;
  let authService: AuthService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    confirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [DashboardCategoryComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        VideoService,
        AuthService,
        { provide: ConfirmationService, useValue: new ConfirmationServiceMock() }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCategoryComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    authService = TestBed.inject(AuthService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should create for Dashboard Category', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values for Dashboard Category', () => {
    expect(component.unbTvChannelId).toBe(UNB_TV_CHANNEL_ID);
    expect(component.videosEduplay).toEqual([]);
    expect(component.unbTvVideos).toEqual([]);
    expect(component.aggregatedVideos).toEqual([]);
    expect(component.catalog).toBeDefined();
    expect(component.categories).toEqual([
      "Arte e Cultura",
      "Documentais",
      "Entrevista",
      "Jornalismo",
      "Pesquisa e Ciência",
      "Séries Especiais",
      "UnBTV",
      "Variedades"
    ]);
    expect(component.selectedCategories).toEqual({});
    expect(component.viewsAllCategories).toBe(0);
    expect(component.videosAllCategories).toBe(0);
  });

  it('should call findAll on ngOnInit for Dashboard Category', () => {
    spyOn(component, 'findAll');
    component.ngOnInit();
    expect(component.findAll).toHaveBeenCalled();
    component.categories.forEach(category => expect(component.selectedCategories[category]).toBeFalse());
  });

  it('should fetch and process videos in findAll for Dashboard Category', () => {
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1', description: 'Description 1', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
      { id: 2, title: 'Video 2', description: 'Description 2', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
    ];
    
    const mockResponse = new HttpResponse({ body: { videoList: mockVideos } });
    
    spyOn(videoService, 'findAll').and.returnValue(of(mockResponse));
    spyOn(component, 'filterVideosByChannel');
    spyOn(component, 'aggregateVideosByCategory');

    component.findAll();
    
    expect(videoService.findAll).toHaveBeenCalled();
    expect(component.videosEduplay).toEqual(mockVideos);
    expect(component.filterVideosByChannel).toHaveBeenCalledWith(mockVideos);
    expect(component.aggregateVideosByCategory).toHaveBeenCalled();
  });

  it('should handle errors in findAll for Dashboard Category', () => {
    spyOn(videoService, 'findAll').and.returnValue(throwError('error'));
    spyOn(console, 'log');
    
    component.findAll();
    
    expect(videoService.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should filter videos by channel for Dashboard Category', () => {
    const mockVideos: IVideo[] = [
      { id: 1, channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
      { id: 2, channels: [{ id: 123, name: 'UnB' }] },
    ];

    component.filterVideosByChannel(mockVideos);

    expect(component.unbTvVideos.length).toBe(1);
    expect(component.unbTvVideos[0].id).toBe(1);
  });

  it('should call confirm of confirmationService when logout is clicked for Dashboard Category', () => {
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
