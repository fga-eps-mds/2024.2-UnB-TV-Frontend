import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordComponent } from './record.component';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;
  let videoService: VideoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RecordComponent],
      providers: [VideoService],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter videos by record and set filteredVideos correctly', () => {
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
  
  it('should call checkRecord service method and set recordVideos', async () => {
    const expectedResponse = [{ id: 1, title: 'Video 1' }];
    const checkRecordSpy = spyOn(videoService, 'checkRecord').and.returnValue(of(expectedResponse));
  
    component.userId = '12345';
    
    await component.checkRecord();
    
    expect(checkRecordSpy).toHaveBeenCalledWith('12345');
    expect(component.recordVideos).toEqual(expectedResponse);
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
});
