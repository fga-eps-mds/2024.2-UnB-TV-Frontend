import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VideoViewerComponent } from './video-viewer.component';
import { VideoCommentComponent } from 'src/app/components/video-comment/video-comment.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { VideoService } from 'src/app/services/video.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IVideo } from 'src/shared/model/video.model';
import * as jwt_decode from 'jwt-decode';

// Mocks
class VideoServiceMock {
  findVideoById(id: number) {
    const mockVideo = {
      id: id,
      title: 'Mock Video Title',
      description: 'Mock Video Description',
    };
    return of(new HttpResponse({ body: mockVideo }));
  }

  getRecommendationFromRecord(userId: string) {
    const mockRecommendation = {
      recommend_videos: {
        1: 'Mock Video Recommendation 1',
        2: 'Mock Video Recommendation 2',
      },
    };
    return of(mockRecommendation);
  }

  //Procurar próximo vídeo
  findAll() {
    const mockResponse = {
      body: {
        videoList: [
          { id: 1, title: 'Video 1', description: 'Description 1' },
          { id: 2, title: 'Video 2', description: 'Description 2' },
        ]
      }
    };
    return of(new HttpResponse({ body: mockResponse.body }));
  }

  checkRecord(userId: string) {
    const mockRecord = {
      videos: {
        1: '2024-01-01T00:00:00Z',
        2: '2024-01-02T00:00:00Z',
      },
    };
    return of(mockRecord);
  }

  // Assistir mais tarde
  addToWatchLater(videoId: string, userId: string) {
    return of({ message: 'Added to watch later list' });
  }

  removeFromWatchLater(videoId: string, userId: string) {
    return of({ message: 'Removed from watch later list' });
  }

  checkWatchLater(videoId: string, userId: string) {
    return of({ status: true });
  }

  // Favorito
  addToFavorite(videoId: string, userId: string) {
    return of({ message: 'Added to favorites list' });
  }

  removeFromFavorite(videoId: string, userId: string) {
    return of({ message: 'Removed from favorite list' });
  }

  checkFavorite(videoId: string, userId: string) {
    return of({ statusfavorite: true });
  }

  // Histórico
  addToRecord(userId: string, videoId: string) {
    return of({ message: 'Added to record' });
  }

  checkTrackingStatus(userId: string) {
    return of({ track_enabled: true });
  }
}

class UserServiceMock {
  getUser(userId: string) {
    const mockUser = {
      id: userId,
      name: 'Mock User',
      email: 'mockuser@example.com',
    };
    return of(mockUser);
  }
}

class AlertServiceMock {
  showMessage() {
    // Apenas um stub para o teste, não precisa fazer nada
  }
}

describe('VideoViewerComponent', () => {
  let component: VideoViewerComponent;
  let fixture: ComponentFixture<VideoViewerComponent>;
  let videoService: VideoService;
  let userService: UserService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoViewerComponent, VideoCommentComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { idVideo: 190329 } } },
        },
        { provide: VideoService, useClass: VideoServiceMock },
        { provide: UserService, useClass: UserServiceMock },
        { provide: AlertService, useClass: AlertServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoViewerComponent);
    component = fixture.componentInstance;
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvYW8xNnZpY3RvcjIwQGdtYWlsLmNvbSIsImV4cCI6MTY5OTMxMjkzNX0.1B9qBJt8rErwBKyD5JCdsPozsw86oQ38tdfDuMM2HFI'
    );
    fixture.detectChanges();
    videoService = TestBed.inject(VideoService);
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    navigator.share = () => {
      {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    };

    navigator.canShare = () => {
      {
        return true;
      }
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should decode token and set userId as a string', () => {
    const token = localStorage.getItem('token') as string;
    const originalJwtDecode = jwt_decode.default;

    // Redefinir a função jwt_decode
    (jwt_decode as any).default = (): { id: string } => ({ id: '1' });

    component.setUserIdFromToken(token);
    expect(component.userId).toBe('1'); // Ensure the userId is '1' as string

    // Restaurar a função original após o teste
    (jwt_decode as any).default = originalJwtDecode;
  });*/

  it('should call findVideoById and set video description', () => {
    const expectedVideo = {
      id: 190329,
      title: 'Mock Video Title',
      description: 'Mock Video Description',
    };
    const mySpy = spyOn(videoService, 'findVideoById').and.returnValue(
      of(new HttpResponse({ body: expectedVideo }))
    );
    component.findVideoById();
    fixture.detectChanges();
    expect(mySpy).toHaveBeenCalledWith(190329);
    expect(component.video).toEqual(expectedVideo);
    expect(component.videoDescription).toEqual(expectedVideo.description);
  });

  it('should toggle showDescription when expandDescription is called', () => {
    expect(component.showDescription).toBe(false);
    component.expandDescription();
    expect(component.showDescription).toBe(true);
    component.expandDescription();
    expect(component.showDescription).toBe(false);
  });

  it('should return the correct video URL', () => {
    component.eduplayVideoUrl = 'https://eduplay.rnp.br/portal/video/';
    component.idVideo = 190329;

    const expectedUrl = 'https://eduplay.rnp.br/portal/video/190329';
    const returnedUrl = component.getVideoUrl();

    expect(returnedUrl).toEqual(expectedUrl);
  });

  it('should share video with native share API on mobile', fakeAsync(() => {
    const shareData = {
      title: component.video.title,
      text: component.video.title,
      url: window.location.href,
    };
    spyOn(window.navigator, 'canShare').and.returnValue(true);
    spyOn(navigator, 'share').and.returnValue(
      new Promise((resolve, reject) => {
        resolve();
      })
    );
    component.shareVideo();
    tick();
    expect(navigator.share).toHaveBeenCalledWith(shareData);
  }));

  it('should handle unsupported share options gracefully', fakeAsync(() => {
    spyOn(navigator, 'canShare').and.returnValue(true);
    spyOn(navigator, 'share').and.returnValue(Promise.reject());
    spyOn((window as any).navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const consoleWarnSpy = spyOn(console, 'error');

    component.shareVideo();
    tick();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Erro ao compartilhar:', undefined);
  }));

  it('should copy video URL to clipboard if native share is not supported', fakeAsync(() => {
    spyOn(navigator, 'canShare').and.returnValue(false);
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const consoleWarnSpy = spyOn(console, 'error');

    component.shareVideo();
    tick();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  }));

  it('should handle clipboard errors gracefully', fakeAsync(() => {
    spyOn(navigator, 'canShare').and.returnValue(false);
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject());
    const consoleWarnSpy = spyOn(console, 'error');

    component.shareVideo();
    tick();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Erro ao copiar URL:', undefined);
  }));

  it('should fetch user details and set user object', () => {
    const expectedUser = {
      id: '1',
      name: 'Mock User',
      email: 'mockuser@example.com',
    };
    const mySpy = spyOn(userService, 'getUser').and.returnValue(of(expectedUser));
    component.getUserDetails();
    fixture.detectChanges();
    expect(mySpy).toHaveBeenCalledWith('1'); // Ensure '1' as string
    expect(component.user).toEqual(expectedUser);
  });

  // Assistir mais tarde
  it('should toggle watch later status and call appropriate service method', () => {
    const addSpy = spyOn(videoService, 'addToWatchLater').and.callThrough();
    const removeSpy = spyOn(videoService, 'removeFromWatchLater').and.callThrough();
    const alertSpy = spyOn(alertService, 'showMessage');

    // Initial state is true, so it should call remove first
    component.toggleWatchLater();
    expect(component.isWatchLater).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('success', 'Sucesso', 'Vídeo removido da lista de Assistir mais tarde.');

    // Now state is false, so it should call add next
    component.toggleWatchLater();
    expect(component.isWatchLater).toBe(true);
    expect(addSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('success', 'Sucesso', 'Vídeo adicionado à lista de Assistir Mais tarde');
  });

  it('should check watch later status and set isWatchLater correctly', () => {
    const mySpy = spyOn(videoService, 'checkWatchLater').and.returnValue(of({ status: true }));
    component.checkWatchLaterStatus();
    fixture.detectChanges();
    expect(mySpy).toHaveBeenCalledWith('190329', '1');
    expect(component.isWatchLater).toBe(true);
  });

  // Favoritar
  it('should toggle favorite status and call appropriate service method', () => {
    const addSpy = spyOn(videoService, 'addToFavorite').and.callThrough();
    const removeSpy = spyOn(videoService, 'removeFromFavorite').and.callThrough();
    const alertSpy = spyOn(alertService, 'showMessage');

    // Initial state is true, so it should call remove first
    component.toggleFavorite();
    expect(component.isFavorite).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('success', 'Sucesso', 'Vídeo removido da lista de Favoritos');

    // Now state is false, so it should call add next
    component.toggleFavorite();
    expect(component.isFavorite).toBe(true);
    expect(addSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('success', 'Sucesso', 'Vídeo adicionado à lista de Favoritos');
  });

  it('should handle favorite toggle errors gracefully', fakeAsync(() => {
    const addSpy = spyOn(videoService, 'addToFavorite').and.returnValue(throwError('Error'));
    const removeSpy = spyOn(videoService, 'removeFromFavorite').and.returnValue(throwError('Error'));
    const alertSpy = spyOn(alertService, 'showMessage');

    // Initial state is true, so it should call remove first
    component.toggleFavorite();
    tick();
    expect(removeSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Erro ao remover o vídeo da lista de favoritos');

    // Now state is false, so it should call add next
    component.toggleFavorite();
    tick();
    expect(addSpy).toHaveBeenCalledWith('190329', '1');
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Erro ao adicionar o vídeo para lista de favoritos');
  }));

  // Histórico
  it('should call addToRecord service method with the correct parameters', () => {
    const addToRecordSpy = spyOn(videoService, 'addToRecord').and.callThrough();
  
    component.userId = '12345';
    component.idVideo = 67890;

    component.addRecord();
  
    expect(addToRecordSpy).toHaveBeenCalledWith('12345', '67890');

    expect(addToRecordSpy(component.userId, component.idVideo.toString()).subscribe).toBeDefined();
  });

  it('should filter videos by record and set filteredVideos correctly video-viewer', () => {
    const recordVideos = {
      videos: {
        190329: true,
        190330: true,
      },
    };

    const unbTvVideos = [
      { id: 190329, title: 'Video Title 1' },
      { id: 190330, title: 'Video Title 2' },
      { id: 190331, title: 'Video Title 3' },
    ];

    component.recordVideos = recordVideos;
    component.unbTvVideos = unbTvVideos;

    component.filterVideosByRecord();
    fixture.detectChanges();

    const expectedFilteredVideos = [
      { id: 190329, title: 'Video Title 1' },
      { id: 190330, title: 'Video Title 2' },
    ];

    expect(component.filteredVideos).toEqual(expectedFilteredVideos);
  });

  it('should filter videos by channel and populate unbTvVideos video-viewer', () => {
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: 12, name: "unbtvchannel" }] },
      { id: 2, title: 'Video 2', channels: [{ id: 13, name: "otherchannel" }] }
    ];
  
    component.unbTvChannelId = 12;
    component.unbTvVideos = [];
  
    component.filterVideosByChannel(mockVideos);
  
    expect(component.unbTvVideos.length).toBe(1);
    expect(component.unbTvVideos[0].id).toBe(1);
  });
  
  it('should call checkRecord service method and set recordVideos video-viewer', async () => {
    const expectedResponse = [{ id: 1, title: 'Video 1' }];
    const checkRecordSpy = spyOn(videoService, 'checkRecord').and.returnValue(of(expectedResponse));
  
    component.userId = '12345';
    
    await component.checkRecord();
    
    expect(checkRecordSpy).toHaveBeenCalledWith('12345');
    expect(component.recordVideos).toEqual(expectedResponse);
  });

  it('should check tracking status and set trackingEnabled correctly', fakeAsync(() => {
    const expectedResponse = { track_enabled: true };
    const checkTrackingStatusSpy = spyOn(videoService, 'checkTrackingStatus').and.returnValue(of(expectedResponse));
    
    component.userId = '1';
    component.checkTrackingStatus().then(() => {
      expect(checkTrackingStatusSpy).toHaveBeenCalledWith('1');
      expect(component.trackingEnabled).toBe(true);
      console.log('Tracking status:', component.trackingEnabled);
    });
    
    tick(); // Simula a passagem do tempo para a chamada assíncrona
  }));
  
  it('should handle checkTrackingStatus errors gracefully', fakeAsync(() => {
    const checkTrackingStatusSpy = spyOn(videoService, 'checkTrackingStatus').and.returnValue(throwError('Error'));
    const consoleErrorSpy = spyOn(console, 'error').and.callThrough(); // Usando callThrough para garantir que a função original ainda seja chamada
  
    component.userId = '1';
    component.checkTrackingStatus().catch(() => {
      expect(checkTrackingStatusSpy).toHaveBeenCalledWith('1');
      expect(component.trackingEnabled).toBeTrue();
    });
  
    tick(); // Simula a passagem do tempo para a chamada assíncrona
  }));

  it('should handle errors when adding to watch later', fakeAsync(() => {
    const addSpy = spyOn(videoService, 'addToWatchLater').and.returnValue(throwError('Error'));
    const consoleErrorSpy = spyOn(console, 'error');
    const alertSpy = spyOn(alertService, 'showMessage');
  
    component.isWatchLater = false;  // Simula o estado inicial
    component.toggleWatchLater();
    tick();  // Avança o tempo para resolver a Promise
  
    expect(addSpy).toHaveBeenCalledWith('190329', '1');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to watch later', 'Error');
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Erro ao adicionar o vídeo para assistir mais tarde');
  }));
  
  it('should handle errors when removing from watch later', fakeAsync(() => {
    const removeSpy = spyOn(videoService, 'removeFromWatchLater').and.returnValue(throwError('Error'));
    const consoleErrorSpy = spyOn(console, 'error');
    const alertSpy = spyOn(alertService, 'showMessage');
  
    component.isWatchLater = true;  // Simula o estado inicial
    component.toggleWatchLater();
    tick();  // Avança o tempo para resolver a Promise
  
    expect(removeSpy).toHaveBeenCalledWith('190329', '1');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing from watch later', 'Error');
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Erro ao remover o vídeo da lista de assistir mais tarde');
  }));

});
