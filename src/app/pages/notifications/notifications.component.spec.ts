import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationsComponent } from './notifications.component';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let videoService: VideoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotificationsComponent],
      providers: [VideoService, NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    spyOn(videoService, 'getFavoriteVideos').and.returnValue(of({ videoList: favoriteVideos }));

    component.getFavoriteVideos();

    expect(component.favoriteVideos.length).toBe(2);
    expect(component.favoriteVideos[0].id).toBe(1);
    expect(component.favoriteVideos[1].id).toBe(2);
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

 /* it('should set userId from token correctly', () => {
    const token = 'dummy.token.payload';
    const mockDecodedToken = { id: '12345' };

    spyOn<any>(jwt_decode, 'default').and.returnValue(mockDecodedToken);

    component.setUserIdFromToken(token);

    expect(component.userId).toBe('12345');
  });*/
});