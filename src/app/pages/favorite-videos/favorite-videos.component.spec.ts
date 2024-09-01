import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteVideosComponent } from './favorite-videos.component';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IVideo } from 'src/shared/model/video.model';
import { FormsModule } from '@angular/forms';

describe('FavoriteVideosComponent', () => {
  let component: FavoriteVideosComponent;
  let fixture: ComponentFixture<FavoriteVideosComponent>;
  let videoServiceMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    videoServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({ body: { videoList: [] } })),
      videosCatalog: jasmine.createSpy('videosCatalog'),
      setVideosCatalog: jasmine.createSpy('setVideosCatalog'),
      getFavoriteVideos: jasmine.createSpy('getFavoriteVideos').and.returnValue(of({ videoList: [] })),
      getWatchLaterVideos: jasmine.createSpy('getWatchLaterVideos').and.returnValue(of({ videoList: [] }))
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: 'user123' }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [FavoriteVideosComponent],
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
    fixture = TestBed.createComponent(FavoriteVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call findAll and getUserDetails on init if authenticated', (done) => {
    spyOn(component, 'findAll').and.callThrough();
    spyOn(component, 'getUserDetails').and.callThrough();
    
    component.ngOnInit().then(() => {
      expect(component.getUserDetails).toHaveBeenCalled();
      expect(component.findAll).toHaveBeenCalled();
      done();
    });
  });
  
  it('should populate videosEduplay and unbTvVideos on findAll success', (done) => {
    const videos: IVideo[] = [
      { id: 1, channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, channels: [{ id: 2, name: 'other' }] }
    ];
  
    videoServiceMock.findAll.and.returnValue(of({ body: { videoList: videos } }));
  
    component.findAll().then(() => {
      expect(component.videosEduplay.length).toBe(2);
      expect(component.videosEduplay[0].id).toBe(1);
      done();
    });
  });
  
  it('should log error on findAll error', (done) => {
    spyOn(console, 'log');
    videoServiceMock.findAll.and.returnValue(throwError('Error'));
  
    component.findAll().catch(() => {
      expect(console.log).toHaveBeenCalledWith('Error');
      done();
    });
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
});