import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

describe('NotificationService', () => {
  let service: NotificationService;
  let videoService: jasmine.SpyObj<VideoService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const videoServiceSpy = jasmine.createSpyObj('VideoService', ['getFavoriteVideos']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: VideoService, useValue: videoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    videoService = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the favorite videos count', () => {
    service.updateFavoriteVideosCount(5);
    service.favoriteVideosCount$.subscribe(count => {
      expect(count).toBe(5);
    });
  });

  it('should fetch and update favorite videos count when authenticated', async () => {
    const mockFavoriteVideos = [
      { video_id: 1, title: 'Video 1' },
      { video_id: 2, title: 'Video 2' }
    ];

    authService.isAuthenticated.and.returnValue(true);
    spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
      service['userId'] = '12345';
    });
    videoService.getFavoriteVideos.and.returnValue(of({ videoList: mockFavoriteVideos }));

    await service.fetchFavoriteVideosCount();

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(service['userId']).toBe('12345');
    expect(videoService.getFavoriteVideos).toHaveBeenCalledWith('12345');
    service.favoriteVideosCount$.subscribe(count => {
      expect(count).toBe(2);
    });
  });

  it('should handle API structure errors gracefully', async () => {
    authService.isAuthenticated.and.returnValue(true);
    spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
      service['userId'] = '12345';
    });
    videoService.getFavoriteVideos.and.returnValue(of({ invalidKey: [] }));

    const consoleWarnSpy = spyOn(console, 'warn');

    await service.fetchFavoriteVideosCount();

    expect(consoleWarnSpy).toHaveBeenCalledWith('A estrutura da resposta da API não está conforme o esperado:', { invalidKey: [] });
    service.favoriteVideosCount$.subscribe(count => {
      expect(count).toBe(0);
    });
  });

  it('should handle API errors gracefully', async () => {
    authService.isAuthenticated.and.returnValue(true);
    spyOn<any>(service, 'setUserIdFromToken').and.callFake(() => {
      service['userId'] = '12345';
    });
    videoService.getFavoriteVideos.and.returnValue(throwError(() => new Error('API Error')));

    const consoleLogSpy = spyOn(console, 'log');

    try {
      await service.fetchFavoriteVideosCount();
      fail('Expected fetchFavoriteVideosCount to throw an error');
    } catch (error) {
      expect(consoleLogSpy).toHaveBeenCalledWith('Erro ao buscar vídeos marcados como "favoritos"', jasmine.any(Error));
    }
  });

  it('should resolve the promise if not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);

    await service.fetchFavoriteVideosCount();

    expect(authService.isAuthenticated).toHaveBeenCalled();
    service.favoriteVideosCount$.subscribe(count => {
      expect(count).toBe(0); // Default value should still be 0
    });
  });

  it('should set userId from token correctly', () => {
    const token = 'dummy.token.payload';
    const mockDecodedToken = { id: '12345' };
   
    spyOn<any>(jwt_decode, 'default').and.returnValue(mockDecodedToken);
   
    service.setUserIdFromToken(token);
   
    expect(service.userId).toBe('12345');
  });
  
});
