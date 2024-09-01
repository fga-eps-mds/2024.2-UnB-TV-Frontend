import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchLaterVideosComponent } from './watchlater-videos.component';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IVideo } from 'src/shared/model/video.model';
import { FormsModule } from '@angular/forms';

describe('WatchLaterVideosComponent', () => {
  let component: WatchLaterVideosComponent;
  let fixture: ComponentFixture<WatchLaterVideosComponent>;
  let videoServiceMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    videoServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({ body: { videoList: [] } })),
      videosCatalog: jasmine.createSpy('videosCatalog'),
      setVideosCatalog: jasmine.createSpy('setVideosCatalog'),
      getWatchLaterVideos: jasmine.createSpy('getWatchLaterVideos').and.returnValue(of({ videoList: [] }))
    };

    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: 'user123' }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [WatchLaterVideosComponent],
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
    fixture = TestBed.createComponent(WatchLaterVideosComponent);
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

  it('should populate watchLaterVideos on getWatchLaterVideos success', () => {
    const watchLaterVideos = [
      { id: 1, video_id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, video_id: 2, title: 'Watch Later 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    component.unbTvVideos = [
      { id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Watch Later 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ videoList: watchLaterVideos }));

    component.getWatchLaterVideos();

    expect(component.watchLaterVideos.length).toBe(2);
    expect(component.watchLaterVideos[0].id).toBe(1);
    expect(component.watchLaterVideos[1].id).toBe(2);
  });


  it('should log warning on getWatchLaterVideos with unexpected structure', () => {
    spyOn(console, 'warn');
    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ incorrectKey: [] }));

    component.getWatchLaterVideos();

    expect(console.warn).toHaveBeenCalledWith('A estrutura da resposta da API não está conforme o esperado:', { incorrectKey: [] });
  });
});