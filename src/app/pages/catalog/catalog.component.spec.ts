import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IVideo } from 'src/shared/model/video.model';
import { FormsModule } from '@angular/forms';

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
      setVideosCatalog: jasmine.createSpy('setVideosCatalog'),
      getFavoriteVideos: jasmine.createSpy('getFavoriteVideos').and.returnValue(of({ videoList: [] }))
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
    videoServiceMock.findAll.and.returnValue(throwError('Error'));

    component.findAll();

    expect(console.log).toHaveBeenCalledWith('Error');
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

  it('should navigate to /videos on program click', () => {
    const videos: IVideo[] = [{ id: 1, title: 'Video 1', channels: [] }];
    component.onProgramClick(videos);
    expect(videoServiceMock.setVideosCatalog).toHaveBeenCalledWith(videos);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videos']);
  });

  it('should populate favoriteVideos on getFavoriteVideos success', () => {
    const favoriteVideos = [
      { id: 1, video_id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, video_id: 2, title: 'Favorite 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    component.unbTvVideos = [
      { id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Favorite 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    videoServiceMock.getFavoriteVideos.and.returnValue(of({ videoList: favoriteVideos }));

    component.getFavoriteVideos();

    expect(component.favoriteVideos.length).toBe(2);
    expect(component.favoriteVideos[0].id).toBe(1);
    expect(component.favoriteVideos[1].id).toBe(2);
  });

  it('should log warning on getFavoriteVideos with unexpected structure', () => {
    spyOn(console, 'warn');
    videoServiceMock.getFavoriteVideos.and.returnValue(of({ incorrectKey: [] }));

    component.getFavoriteVideos();

    expect(console.warn).toHaveBeenCalledWith('A estrutura da resposta da API não está conforme o esperado:', { incorrectKey: [] });
  });

  it('should filter videos to favorite when checkbox is checked', () => {
    const favoriteVideos = [
      { id: 1, video_id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    component.unbTvVideos = [
      { id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Not Favorite', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    videoServiceMock.getFavoriteVideos.and.returnValue(of({ videoList: favoriteVideos }));

    component.filterFavorite = true;
    component.onFilterFavoriteVideosChange();

    expect(component.filteredVideos.length).toBe(1);
    expect(component.filteredVideos[0].title).toBe('Favorite 1');
  });

  it('should not filter videos to favorite when checkbox is unchecked', () => {
    const favoriteVideos = [
      { id: 1, video_id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    component.unbTvVideos = [
      { id: 1, title: 'Favorite 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Not Favorite', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    videoServiceMock.getFavoriteVideos.and.returnValue(of({ videoList: favoriteVideos }));

    component.filterFavorite = false;
    component.onFilterFavoriteVideosChange();

    expect(component.filteredVideos.length).toBe(2);
  });
});

