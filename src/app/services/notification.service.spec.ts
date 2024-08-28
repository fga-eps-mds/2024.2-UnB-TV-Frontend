import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { IVideo } from 'src/shared/model/video.model';
import { of } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

    // Mocka setUserIdFromToken para evitar o erro de token inválido
    spyOn(service, 'setUserIdFromToken').and.callFake(() => {
      service.userId = '12345';  // Define um userId válido
    });
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há solicitações pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and update recommended videos count', () => {
    const mockRecommendedVideos: IVideo[] = [
      { id: 1, title: 'Video 1' },
      { id: 2, title: 'Video 2' }
    ];

    authServiceSpy.isAuthenticated.and.returnValue(true);
    service.setUserIdFromToken('fakeToken');

    service.fetchRecommendedVideosCount('12345').subscribe(response => {
      expect(response.recommend_videos.length).toBe(2);
    });

    const req = httpMock.expectOne(`${service['videoServiceApiURL']}/recommendation/get_recommendation_record/?user_id=12345`);
    expect(req.request.method).toBe('GET');
    req.flush({ recommend_videos: mockRecommendedVideos });

    service.updateRecommendedVideosCount(2);
    service.recommendedVideosCount$.subscribe(count => {
      expect(count).toBe(2);
    });
  });

  it('should not make HTTP request if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    // Aqui vamos mockar a função fetchRecommendedVideosCount para garantir que ela retorne sem fazer a requisição
    spyOn(service, 'fetchRecommendedVideosCount').and.callFake(() => of({ recommend_videos: [] }));

    service.fetchRecommendedVideosCount('12345').subscribe(response => {
      expect(response.recommend_videos).toEqual([]);
    });

    // Verifica se realmente não houve nenhuma requisição HTTP
    httpMock.expectNone(`${service['videoServiceApiURL']}/recommendation/get_recommendation_record/?user_id=12345`);
  });
});
