import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IVideo } from 'src/shared/model/video.model';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let videoServiceMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    videoServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({ body: { videoList: [] } })),
      videosCatalog: jasmine.createSpy('videosCatalog'),
      setVideosCatalog: jasmine.createSpy('setVideosCatalog')
    };

    authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: 'user123' }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      imports: [FormsModule],
      providers: [
        { provide: VideoService, useValue: videoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call findAll and getUserDetails on init if authenticated', () => {
    spyOn(component, 'findAll').and.callThrough();
    spyOn(component, 'getUserDetails').and.callThrough();
    component.ngOnInit();
    expect(component.isAuthenticated).toBe(true);
    expect(component.getUserDetails).toHaveBeenCalled();
    expect(component.findAll).toHaveBeenCalled();
  });

  it('should call setUserIdFromToken when token is available', () => {
    spyOn(component, 'setUserIdFromToken').and.callThrough();
    localStorage.setItem('token', 'mock-token');
    component.ngOnInit();
    expect(component.setUserIdFromToken).toHaveBeenCalledWith('mock-token');
  });

  it('should handle invalid token in setUserIdFromToken', () => {
    spyOn(console, 'error');
    component.setUserIdFromToken(null);
    expect(console.error).toHaveBeenCalledWith('Token inválido');
  });

  it('should handle error in setUserIdFromToken', () => {
    spyOn(console, 'error');
    component.setUserIdFromToken('invalid-token');
    expect(console.error).toHaveBeenCalledWith('Erro ao decodificar token:', jasmine.any(Error));
  });

  it('should populate videosEduplay and unbTvVideos on findAll success', () => {
    const videos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 2, name: 'other' }] }
    ];

    videoServiceMock.findAll.and.returnValue(of({ body: { videoList: videos } }));
    component.findAll();
    expect(component.videosEduplay.length).toBe(2);
    expect(component.videosEduplay[0].id).toBe(1);
  });

  it('should log error on findAll error', () => {
    spyOn(console, 'log');
    videoServiceMock.findAll.and.returnValue(throwError(() => new Error('Error')));
    component.findAll();
    expect(console.log).toHaveBeenCalledWith(new Error('Error'));
  });

  it('should filter videos based on filterTitle', () => {
    component.unbTvVideos = [
      { id: 1, title: 'Angular', description: '', keywords: '', catalog: '' },
      { id: 2, title: 'React', description: '', keywords: '', catalog: '' }
    ];
    component.filterTitle = 'Angular';
    component.filterVideos();
    expect(component.filteredVideos).toEqual([component.unbTvVideos[0]]);
  });

  it('should filter videos by channel in filterVideosByChannel', () => {
    const videos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 2, name: 'other' }] }
    ];
    component.filterVideosByChannel(videos);
    expect(component.unbTvVideos.length).toBe(1);
    expect(component.unbTvVideos[0].id).toBe(1);
  });

  it('should navigate to /videos on program click', () => {
    const videos: IVideo[] = [{ id: 1, title: 'Video 1', channels: [] }];
    component.onProgramClick(videos);
    expect(videoServiceMock.setVideosCatalog).toHaveBeenCalledWith(videos);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videos']);
  });

  it('should return the max number of thumbnails for a section', () => {
    component.videoCatalog = {
      interviews: [
        { title: 'Entrevista 1', imageUrl: 'img1.jpg' },
        { title: 'Entrevista 2', imageUrl: 'img2.jpg' }
      ]
    };
    expect(component.getMaxThumbnailsForSection('interviews')).toBe(2);
  });

  it('should increase sliderState when scrolling right', () => {
    component.videoCatalog = { interviews: new Array(6).fill({}) };
    component.sliderStates = { interviews: 4 };
    component.scrollThumbnails('interviews', 'right');
    expect(component.sliderStates['interviews']).toBe(6);
  });

  it('should not exceed max thumbnails when scrolling right', () => {
    component.videoCatalog = { interviews: new Array(6).fill({}) };
    component.sliderStates = { interviews: 6 };
    component.scrollThumbnails('interviews', 'right');
    expect(component.sliderStates['interviews']).toBe(6);
  });

  it('should decrease sliderState when scrolling left', () => {
    component.sliderStates = { interviews: 8 };
    component.scrollThumbnails('interviews', 'left');
    expect(component.sliderStates['interviews']).toBe(4);
  });

  it('should not decrease below the minimum when scrolling left', () => {
    component.sliderStates = { interviews: 4 };
    component.scrollThumbnails('interviews', 'left');
    expect(component.sliderStates['interviews']).toBe(4);
  });
});
