import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BackgroundComponent } from './background.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuModule } from 'primeng/menu';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('BackgroundComponent', () => {
  let component: BackgroundComponent;
  let fixture: ComponentFixture<BackgroundComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MenuModule, HttpClientTestingModule],
      declarations: [BackgroundComponent],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            fetchRecommendedVideosCount: jasmine.createSpy('fetchRecommendedVideosCount').and.returnValue(of({ recommend_videos: [{}, {}, {}] })),
            recommendedVideosCount$: of(5),
            isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
            setUserIdFromToken: jasmine.createSpy('setUserIdFromToken'),
            userId: 'mockUserId',
            updateRecommendedVideosCount: jasmine.createSpy('updateRecommendedVideosCount')
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy(); // Certifique-se de limpar após cada teste
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items and start fetching notifications', fakeAsync(() => {
    expect(notificationService.fetchRecommendedVideosCount).toHaveBeenCalled();
    expect(notificationService.setUserIdFromToken).toHaveBeenCalled();
    expect(component.hasNotifications).toBeTrue(); // Verifica se as notificações foram atualizadas
  }));

  it('should correctly update the notification count', fakeAsync(() => {
    const response = { recommend_videos: [{}, {}, {}] };
    component.updateNotificationCount(response);

    tick(); // Avança o tempo para garantir a execução da lógica

    expect(notificationService.updateRecommendedVideosCount).toHaveBeenCalledWith(3);
    expect(component.hasNotifications).toBeTrue();
  }));

  it('should correctly identify the user device as mobile or not', () => {
    const originalUserAgent = navigator.userAgent;
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';

    Object.defineProperty(navigator, 'userAgent', {
      value: mobileUserAgent,
      writable: true,
      configurable: true
    });

    component.identifiesUserDevice();
    expect(component.mobileDevide).toBeTrue(); // Agora deve passar

    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent
    });
  });

  it('should update the notification label', () => {
    component.updateNotificationLabel();
    fixture.detectChanges();
    
    const notificationItem = component.items.find(item => item.routerLink === '/notifications');
    expect(notificationItem?.label).toContain('Notificações <span class="notification-badge"');
  });

  it('should clear interval subscription on destroy', () => {
    const unsubscribeSpy = spyOn(component['intervalSubscription'] as any, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
