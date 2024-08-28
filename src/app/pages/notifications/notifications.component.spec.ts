import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationsComponent } from './notifications.component';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let videoService: VideoService;
  let notificationService: NotificationService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotificationsComponent],
      providers: [VideoService, NotificationService, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    notificationService = TestBed.inject(NotificationService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate recommendedVideos on fetchRecommendedVideos success', async () => {
    component.unbTvVideos = [
      { id: 1, title: 'Video 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 3, title: 'Video 3', channels: [{ id: 1, name: 'unbtv' }] }
    ];

    const recommendedVideoIds = [1, 2];

    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(notificationService, 'fetchRecommendedVideosCount').and.returnValue(of({ recommend_videos: recommendedVideoIds }));
    spyOn(notificationService, 'setUserIdFromToken');

    await component.fetchRecommendedVideos();

    expect(component.recommendedVideos.length).toBe(2);
    expect(component.recommendedVideos.map(v => v.id)).toEqual([1, 2]);
  });

  it('should filter videos by channel and populate unbTvVideos', () => {
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

  it('should call findAll service method and set videosEduplay', async () => {
    const expectedData = {
      body: {
        videoList: [{ id: 1, title: 'Eduplay Video 1' }]
      }
    };

    const findAllSpy = spyOn(videoService, 'findAll').and.returnValue(of(new HttpResponse({ body: expectedData.body })));
    const filterSpy = spyOn(component, 'filterVideosByChannel').and.callThrough();
    const videosCatalogSpy = spyOn(videoService, 'videosCatalog').and.callThrough();

    await component.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(component.videosEduplay).toEqual(expectedData.body.videoList);
    expect(filterSpy).toHaveBeenCalledWith(expectedData.body.videoList);
    expect(videosCatalogSpy).toHaveBeenCalledWith(component.unbTvVideos, component.catalog);
  });


  it('should mark notifications as read', () => {
    spyOn(localStorage, 'setItem');
    spyOn(notificationService, 'updateRecommendedVideosCount');
    spyOn(component['cdr'], 'detectChanges');

    component.markAsRead();

    expect(localStorage.setItem).toHaveBeenCalledWith('notificationsRead', 'true');
    expect(notificationService.updateRecommendedVideosCount).toHaveBeenCalledWith(0);
    expect(component.notificationsRead).toBeTrue();
    expect(component.recommendedVideos.length).toBe(0);
    expect(component.numberOfRecommendedVideos).toBe(0);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });
});

