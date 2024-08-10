import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { VideoViewsComponent } from './video-views.component';
import { IVideo } from 'src/shared/model/video.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms' 
import { HttpResponse } from '@angular/common/http';

class ConfirmationServiceMock {
  confirm() { }
}

describe('VideoViewsComponent', () => {
  let component: VideoViewsComponent;
  let fixture: ComponentFixture<VideoViewsComponent>;
  let videoService: VideoService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    confirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [VideoViewsComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        VideoService, 
        { provide: ConfirmationService, useValue: new ConfirmationServiceMock() }]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoViewsComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.unbTvChannelId).toBe(UNB_TV_CHANNEL_ID);
    expect(component.videosEduplay).toEqual([]);
    expect(component.unbTvVideos).toEqual([]);
    expect(component.catalog).toBeDefined();
    expect(component.filteredVideos).toEqual([]);
    expect(component.filterId).toBe('');
    expect(component.filterTitle).toBe('');
    expect(component.filterDescription).toBe('');
    expect(component.selectedCategories).toEqual({});
    expect(component.categories).toEqual([
      "Todas",
      "Arte e Cultura",
      "Documentais",
      "Entrevista",
      "Jornalismo",
      "Pesquisa e Ciência",
      "Séries Especiais",
      "UnBTV",
      "Variedades"
    ]);
    expect(component.sortAscending).toBeTrue();
    expect(component.isSorted).toBeFalse();
  });

  it('should call findAll on ngOnInit', () => {
    spyOn(component, 'findAll');
    component.ngOnInit();
    expect(component.findAll).toHaveBeenCalled();
    expect(component.filteredVideos).toEqual(component.unbTvVideos);
    component.categories.forEach(category => {
      if (category === "Todas"){
        expect(component.selectedCategories[category]).toBeTrue()
      }else{
        expect(component.selectedCategories[category]).toBeFalse()
      }
    });
  });

  it('should fetch and process videos in findAll', () => {
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1', description: 'Description 1', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
      { id: 2, title: 'Video 2', description: 'Description 2', channels: [{ id: UNB_TV_CHANNEL_ID, name: 'UnBTV' }] },
    ];
  
    const mockResponse = new HttpResponse({ body: { videoList: mockVideos } });
  
    spyOn(videoService, 'findAll').and.returnValue(of(mockResponse));
    spyOn(component, 'filterVideosByChannel');
    spyOn(component, 'cleanDescriptions');
    spyOn(component, 'filterVideos');
  
    component.findAll();
  
    expect(videoService.findAll).toHaveBeenCalled();
    expect(component.videosEduplay).toEqual(mockVideos);
    expect(component.filterVideosByChannel).toHaveBeenCalledWith(mockVideos);
    expect(component.cleanDescriptions).toHaveBeenCalled();
    expect(component.filterVideos).toHaveBeenCalled();
  });

  it('should handle errors in findAll', () => {
    spyOn(videoService, 'findAll').and.returnValue(throwError('error'));
    spyOn(console, 'log');

    component.findAll();

    expect(videoService.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('error');
  });

  it('should clean HTML descriptions', () => {
    component.unbTvVideos = [
      { id: 1, description: '<p>Description 1</p>' },
      { id: 2, description: '<p>Description 2</p>' },
    ];

    component.cleanDescriptions();

    expect(component.unbTvVideos[0].description).toBe('Description 1');
    expect(component.unbTvVideos[1].description).toBe('Description 2');
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

  it('should filter videos based on filters and selected categories', () => {
    component.unbTvVideos = [
      { id: 1, title: 'Video 1', description: 'Description 1', catalog: 'Jornalismo' },
      { id: 2, title: 'Video 2', description: 'Description 2', catalog: 'Entrevista' },
    ];

    component.filterId = '1';
    component.filterTitle = 'Video';
    component.filterDescription = 'Description';
    component.selectedCategories = { 'Todas': false, 'Jornalismo': true, 'Entrevista': false };

    component.filterVideos();

    expect(component.filteredVideos.length).toBe(1);
    expect(component.filteredVideos[0].id).toBe(1);
  });

  it('should sort videos based on access count', () => {
    component.filteredVideos = [
      { id: 1, qtAccess: 5 },
      { id: 2, qtAccess: 10 },
      { id: 3, qtAccess: 2 },
    ];

    component.sortVideos();

    expect(component.filteredVideos[0].id).toBe(3);
    expect(component.filteredVideos[1].id).toBe(1);
    expect(component.filteredVideos[2].id).toBe(2);

    component.sortAscending = false;
    component.sortVideos();

    expect(component.filteredVideos[0].id).toBe(2);
    expect(component.filteredVideos[1].id).toBe(1);
    expect(component.filteredVideos[2].id).toBe(3);
  });

  it('should change sort order and sort videos', () => {
    spyOn(component, 'sortVideos');

    component.changeSortOrder();

    expect(component.sortAscending).toBeFalse();
    expect(component.sortVideos).toHaveBeenCalled();
    expect(component.isSorted).toBeTrue();
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
