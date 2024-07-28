import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { CategoryTableComponent } from './category-table.component';
import { IVideo } from 'src/shared/model/video.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms' 

class ConfirmationServiceMock {
  confirm() { }
}

describe('CategoryTableComponent', () => {
  let component: CategoryTableComponent;
  let fixture: ComponentFixture<CategoryTableComponent>;
  let videoService: VideoService;
  let authService: AuthService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    confirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    
    await TestBed.configureTestingModule({
      declarations: [CategoryTableComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        VideoService,
        AuthService,
        { provide: ConfirmationService, useValue: new ConfirmationServiceMock() }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTableComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    authService = TestBed.inject(AuthService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.unbTvChannelId).toBe(UNB_TV_CHANNEL_ID);
    expect(component.videosEduplay).toEqual([]);
    expect(component.unbTvVideos).toEqual([]);
    expect(component.aggregatedVideos).toEqual([]);
    expect(component.catalog).toBeDefined();
    expect(component.sortColumn).toBe('');
    expect(component.sortAscending).toBeTrue();
    expect(component.selectedColumn).toBe('');
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
    expect(component.filteredAggregatedVideos).toEqual([]);
    expect(component.selectedCategories).toEqual({});
  });

  it('should call findAll on ngOnInit', () => {
    spyOn(component, 'findAll');
    component.ngOnInit();
    expect(component.findAll).toHaveBeenCalled();
    component.categories.forEach(category => expect(component.selectedCategories[category]).toBeFalse());
  });

  it('should fetch and process videos in findAll', () => {
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1', description: 'Description 1', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
      { id: 2, title: 'Video 2', description: 'Description 2', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
    ];
    
    const mockResponse = new HttpResponse({ body: { videoList: mockVideos } });
    
    spyOn(videoService, 'findAll').and.returnValue(of(mockResponse));
    spyOn(component, 'filterVideosByChannel');
    spyOn(component, 'aggregateVideosByCategory');
    spyOn(component, 'filterCategories');

    component.findAll();
    
    expect(videoService.findAll).toHaveBeenCalled();
    expect(component.videosEduplay).toEqual(mockVideos);
    expect(component.filterVideosByChannel).toHaveBeenCalledWith(mockVideos);
    expect(component.aggregateVideosByCategory).toHaveBeenCalled();
    expect(component.filterCategories).toHaveBeenCalled();
  });

  it('should handle errors in findAll', () => {
    spyOn(videoService, 'findAll').and.returnValue(throwError('error'));
    spyOn(console, 'log');
    
    component.findAll();
    
    expect(videoService.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should filter videos by channel', () => {
    const mockVideos: IVideo[] = [
      { id: 1, channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
      { id: 2, channels: [{ id: 123, name: 'UnB' }] },
    ];

    component.filterVideosByChannel(mockVideos);

    expect(component.unbTvVideos.length).toBe(1);
    expect(component.unbTvVideos[0].id).toBe(1);
  });

  it('should aggregate videos by category', () => {
    component.unbTvVideos = [
      { id: 1, catalog: 'Jornalismo', qtAccess: 10 },
      { id: 2, catalog: 'Entrevista', qtAccess: 20 },
      { id: 3, catalog: 'Jornalismo', qtAccess: 30 },
    ];

    component.aggregateVideosByCategory();

    expect(component.aggregatedVideos.length).toBe(8);
    expect(component.aggregatedVideos).toContain({
      category: 'Jornalismo',
      videoCount: 2,
      totalViews: 40,
      viewsPerVideo: 20
    });
    expect(component.aggregatedVideos).toContain({
      category: 'Entrevista',
      videoCount: 1,
      totalViews: 20,
      viewsPerVideo: 20
    });
  });

  it('should filter aggregated videos by selected categories', () => {
    component.aggregatedVideos = [
      { category: 'Jornalismo', videoCount: 1, totalViews: 10, viewsPerVideo: 10 },
      { category: 'Entrevista', videoCount: 1, totalViews: 20, viewsPerVideo: 20 },
    ];

    component.selectedCategories = { 'Jornalismo': true, 'Entrevista': false };

    component.filterCategories();

    expect(component.filteredAggregatedVideos.length).toBe(1);
    expect(component.filteredAggregatedVideos[0].category).toBe('Jornalismo');
  });

  it('should sort aggregated videos by selected column', () => {
    component.aggregatedVideos = [
      { category: 'Jornalismo', videoCount: 1, totalViews: 10, viewsPerVideo: 10 },
      { category: 'Entrevista', videoCount: 1, totalViews: 20, viewsPerVideo: 20 },
    ];

    component.filterCategories(); // Certifique-se de que filteredAggregatedVideos seja preenchido

    component.sortColumn = 'totalViews';
    component.sortAscending = true;

    component.sortAggregatedVideos();

    expect(component.filteredAggregatedVideos[0].category).toBe('Jornalismo');
    expect(component.filteredAggregatedVideos[1].category).toBe('Entrevista');

    component.sortAscending = false;

    component.sortAggregatedVideos();

    expect(component.filteredAggregatedVideos[0].category).toBe('Entrevista');
    expect(component.filteredAggregatedVideos[1].category).toBe('Jornalismo');
  });

  it('should set sort column and order', () => {
    component.setSortColumn('totalViews');

    expect(component.sortColumn).toBe('totalViews');
    expect(component.sortAscending).toBeTrue();

    component.setSortColumn('totalViews');

    expect(component.sortAscending).toBeFalse();
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
