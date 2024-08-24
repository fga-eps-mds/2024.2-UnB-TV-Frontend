import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let videoService: VideoService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        VideoService,
        AuthService,
      ],
    });

    service = TestBed.inject(NotificationService);
    videoService = TestBed.inject(VideoService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchFavoriteVideosCount', () => {
    it('should fetch and update favorite videos count when authenticated', async () => {
      const mockFavoriteVideos = [
        { video_id: 1, title: 'Video 1' },
        { video_id: 2, title: 'Video 2' }
      ];

      spyOn(authService, 'isAuthenticated').and.returnValue(true);
      spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
        service['userId'] = '12345';
      });
      spyOn(videoService, 'getFavoriteVideos').and.returnValue(of({ videoList: mockFavoriteVideos }));

      await service.fetchFavoriteVideosCount();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(service['userId']).toBe('12345');
      expect(videoService.getFavoriteVideos).toHaveBeenCalledWith('12345');
      service.favoriteVideosCount$.subscribe(count => {
        expect(count).toBe(2);
      });
    });

    it('should handle API structure errors gracefully', async () => {
      spyOn(authService, 'isAuthenticated').and.returnValue(true);
      spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
        service['userId'] = '12345';
      });
      spyOn(videoService, 'getFavoriteVideos').and.returnValue(of({ invalidKey: [] }));

      const consoleWarnSpy = spyOn(console, 'warn');

      await service.fetchFavoriteVideosCount();

      expect(consoleWarnSpy).toHaveBeenCalledWith('A estrutura da resposta da API não está conforme o esperado:', { invalidKey: [] });
      service.favoriteVideosCount$.subscribe(count => {
        expect(count).toBe(0);
      });
    });

    it('should handle API errors gracefully', async () => {
      spyOn(authService, 'isAuthenticated').and.returnValue(true);
      spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
        service['userId'] = '12345';
      });
      spyOn(videoService, 'getFavoriteVideos').and.returnValue(throwError(() => new Error('API Error')));

      const consoleLogSpy = spyOn(console, 'log');

      try {
        await service.fetchFavoriteVideosCount();
        fail('Expected fetchFavoriteVideosCount to throw an error');
      } catch (error) {
        expect(consoleLogSpy).toHaveBeenCalledWith('Erro ao buscar vídeos marcados como "favoritos"', jasmine.any(Error));
      }
    });

    it('should resolve the promise if not authenticated', async () => {
      spyOn(authService, 'isAuthenticated').and.returnValue(false);

      await service.fetchFavoriteVideosCount();

      expect(authService.isAuthenticated).toHaveBeenCalled();
      service.favoriteVideosCount$.subscribe(count => {
        expect(count).toBe(0); // Default value should still be 0
      });
    });
  });
});
