import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BackgroundComponent } from './background.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuModule } from 'primeng/menu';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';

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

  it('should log "User is not authenticated" when user is not authenticated', () => {
    (notificationService.isAuthenticated as jasmine.Spy).and.returnValue(false);
    spyOn(console, 'log');

    component.ngOnInit();

    expect(console.log).toHaveBeenCalledWith('User is not authenticated');
  });

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

  it('should toggle dark mode', () => {
    // Simula a ativação do modo escuro
    let isChecked = true;
    let event = { target: { checked: isChecked } } as unknown as Event;

    component.toggleDarkMode(event);
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();
    expect(component.isDarkMode).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    // Simula a desativação do modo escuro
    isChecked = false;
    event = { target: { checked: isChecked } } as unknown as Event;

    component.toggleDarkMode(event);
    expect(document.documentElement.classList.contains('dark-theme')).toBeFalse();
    expect(component.isDarkMode).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should add "dark-theme" class to document element when applyTheme is called with true', () => {
    document.documentElement.classList.remove('dark-theme'); // Ensure the class is not present
    expect(document.documentElement.classList.contains('dark-theme')).toBeFalse();

    component.isDarkMode = true; // Defina isDarkMode como true
    component.applyTheme();

    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();
  });
  
  it('should remove "dark-theme" class from document element when applyTheme is called with false', () => {
    document.documentElement.classList.add('dark-theme'); // Ensure the class is present
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();

    component.isDarkMode = false; // Defina isDarkMode como false
    component.applyTheme();

    expect(document.documentElement.classList.contains('dark-theme')).toBeFalse();
  });
  
  it('should fetch recommended videos count at intervals', fakeAsync(() => {
    const mockToken = 'mockToken';
    const mockUserId = 'mockUserId';
    const mockResponse = 5;
    const mockCount = new BehaviorSubject<number>(0);

    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    (notificationService.isAuthenticated as jasmine.Spy).and.returnValue(true);
    (notificationService.setUserIdFromToken as jasmine.Spy).and.callFake(() => {
      notificationService.userId = mockUserId;
    });
    (notificationService.fetchRecommendedVideosCount as jasmine.Spy).and.returnValue(of(mockResponse));
    notificationService.recommendedVideosCount$ = mockCount.asObservable();

    spyOn(component, 'updateNotificationCount');
    spyOn(component, 'updateNotificationLabel');

    component.ngOnInit();

    // Simula a passagem do tempo
    tick(300000);

    expect(notificationService.isAuthenticated).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(notificationService.setUserIdFromToken).toHaveBeenCalledWith(mockToken);
    expect(notificationService.fetchRecommendedVideosCount).toHaveBeenCalledWith(mockUserId);
    expect(component.updateNotificationCount).toHaveBeenCalledWith(mockResponse);

    // Simula a emissão de um novo valor pelo BehaviorSubject
    mockCount.next(3);
    tick();

    expect(component.hasNotifications).toBeTrue();
    expect(component.updateNotificationLabel).toHaveBeenCalled();

    // Interrompendo qualquer timer ativo
    component.ngOnDestroy();
    tick(300000); // Avança o tempo para garantir que o timer foi limpo
  })); 

  it('should update notification count when there are recommended videos', () => {
    const response = { recommend_videos: [{}, {}, {}] };
    spyOn(console, 'log');
    spyOn(component, 'updateNotificationLabel');

    component.updateNotificationCount(response);

    expect(console.log).toHaveBeenCalledWith('Updating notification count with:', 3);
    expect(component.hasNotifications).toBeTrue();
    expect(notificationService.updateRecommendedVideosCount).toHaveBeenCalledWith(3);
    expect(component.updateNotificationLabel).toHaveBeenCalled();
  });

  it('should log "No videos found in response" and update notifications when no videos are found', () => {
    const response = { recommend_videos: [] };
    spyOn(console, 'log');
    spyOn(component, 'updateNotificationLabel');

    component.updateNotificationCount(response);

    expect(console.log).toHaveBeenCalledWith('No videos found in response');
    expect(component.hasNotifications).toBeFalse();
    expect(component.updateNotificationLabel).toHaveBeenCalled();
  });

  it('should log "No videos found in response" and update notifications when response is null', () => {
    const response = null;
    spyOn(console, 'log');
    spyOn(component, 'updateNotificationLabel');

    component.updateNotificationCount(response);

    expect(console.log).toHaveBeenCalledWith('No videos found in response');
    expect(component.hasNotifications).toBeFalse();
    expect(component.updateNotificationLabel).toHaveBeenCalled();
  });
});