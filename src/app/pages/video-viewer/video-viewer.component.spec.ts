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

  // Historico
  it('should call addToRecord service method with the correct parameters', () => {
    const addToRecordSpy = spyOn(videoService, 'addToRecord').and.callThrough();
  
    component.userId = '12345';
    component.idVideo = 67890;

    component.addRecord();
  
    expect(addToRecordSpy).toHaveBeenCalledWith('12345', '67890');

    expect(addToRecordSpy(component.userId, component.idVideo.toString()).subscribe).toBeDefined();
  });
  
});
