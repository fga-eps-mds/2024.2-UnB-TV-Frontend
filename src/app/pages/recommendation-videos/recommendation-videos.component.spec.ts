import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecommendationVideosComponent } from './recommendation-videos.component';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { of, throwError } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

describe('RecommendationVideosComponent', () => {
  let component: RecommendationVideosComponent;
  let fixture: ComponentFixture<RecommendationVideosComponent>;
  let userService: UserService;
  let videoService: VideoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [RecommendationVideosComponent],
      providers: [UserService, VideoService],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationVideosComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    videoService = TestBed.inject(VideoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check and set tracking status from localStorage', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'trackingEnabled') {
        return 'false';
      }
      return null;
    });

    component.checkTrackingStatus();

    expect(component.trackingEnabled).toBe(false);
  });

  it('should call findAll and populate videosEduplay and unbTvVideos', async () => {
    const mockResponse = {
      body: {
        videoList: [{ id: 1, title: 'Video 1', channels: [{ id: 12, name: 'unbtvchannel' }] }]
      }
    };

    const findAllSpy = spyOn(videoService, 'findAll').and.returnValue(of(new HttpResponse({ body: mockResponse.body })));
    const filterSpy = spyOn(component, 'filterVideosByChannel').and.callThrough();
    const videosCatalogSpy = spyOn(videoService, 'videosCatalog').and.callThrough();

    await component.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(component.videosEduplay).toEqual(mockResponse.body.videoList);
    expect(filterSpy).toHaveBeenCalledWith(mockResponse.body.videoList);
    expect(videosCatalogSpy).toHaveBeenCalledWith(component.unbTvVideos, component.catalog);
  });

  it('should filter videos by channel and populate unbTvVideos', () => {
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: component.unbTvChannelId, name: 'unbtvchannel' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 13, name: 'otherchannel' }] }
    ];

    component.unbTvVideos = [];
    component.filterVideosByChannel(mockVideos);

    expect(component.unbTvVideos.length).toBe(1);
    expect(component.unbTvVideos[0].id).toBe(1);
  });

  it('should call getUserDetails and fetch user data', () => {
    const mockUser = { id: '12345', name: 'Test User' };
    const getUserSpy = spyOn(userService, 'getUser').and.returnValue(of(mockUser));
    const recommendSpy = spyOn(component, 'recommendVideosByRecord').and.callThrough();

    component.userId = '12345';
    component.getUserDetails();

    expect(getUserSpy).toHaveBeenCalledWith('12345');
    expect(component.user).toEqual(mockUser);
    expect(recommendSpy).toHaveBeenCalled();
  });

  it('should call recommendVideosByRecord and filter recommended videos', () => {
    const mockRecommendation = {
      recommend_videos: [1, 2]
    };
    const mockVideos: IVideo[] = [
      { id: 1, title: 'Video 1' },
      { id: 2, title: 'Video 2' },
      { id: 3, title: 'Video 3' }
    ];

    spyOn(videoService, 'getRecommendationFromRecord').and.returnValue(of(mockRecommendation));
    component.unbTvVideos = mockVideos;

    component.recommendVideosByRecord();

    expect(component.recommendVideos.length).toBe(2);
    expect(component.recommendVideos).toEqual([{ id: 1, title: 'Video 1' }, { id: 2, title: 'Video 2' }]);
  });

  it('should handle error during getUserDetails', () => {
    const getUserSpy = spyOn(userService, 'getUser').and.returnValue(throwError({ status: 500 }));
    const consoleErrorSpy = spyOn(console, 'error');

    component.userId = '12345';
    component.getUserDetails();

    expect(getUserSpy).toHaveBeenCalledWith('12345');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user details', { status: 500 });
  });
});
