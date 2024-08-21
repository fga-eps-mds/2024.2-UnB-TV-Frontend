import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // Importando FormsModule
import { RecordComponent } from './record.component';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';


describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;
  let videoService: VideoService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], // Adicionando FormsModule aqui
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
    const expectedResponse = { videos: { 1: 'Video 1' } };
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


  /*it('should set userId from token correctly', () => {
    const token = 'dummy.token.payload';
    const mockDecodedToken = { id: '12345' };
   
    spyOn<any>(jwt_decode, 'default').and.returnValue(mockDecodedToken);
   
    component.setUserIdFromToken(token);
   
    expect(component.userId).toBe('12345');
  });*/


 it('should toggle tracking and update tracking status', () => {
  component.userId = '12345'; // Defina o userId corretamente
 
  const toggleSpy = spyOn(videoService, 'toggleTracking').and.returnValue(of({ message: 'Tracking updated' }));
  const saveSpy = spyOn(component, 'saveTrackingStatus').and.callThrough();
 
  component.toggleTracking(false);
 
  expect(component.trackingEnabled).toBe(false);
  expect(saveSpy).toHaveBeenCalled();
  expect(toggleSpy).toHaveBeenCalledWith('12345', false);
});


it('should sort records in ascending order and update filteredVideos', () => {
  component.userId = '12345'; // Defina o userId corretamente
 
  const mockResponse = {
    videos: {
      190329: '2024-08-14 12:00:00',
      190330: '2024-08-14 13:00:00'
    }
  };
 
  const sortSpy = spyOn(videoService, 'getRecordSorted').and.returnValue(of(mockResponse));
  component.unbTvVideos = [
    { id: 190329, title: 'Video Title 1' },
    { id: 190330, title: 'Video Title 2' }
  ];
 
  component.sortRecord(true);
 
  expect(sortSpy).toHaveBeenCalledWith('12345', true);
  expect(component.filteredVideos.length).toBe(2);
  expect(component.filteredVideos[0].id).toBe(190329);
});




it('should handle errors when sorting records', () => {
  component.userId = '12345'; // Defina explicitamente o userId antes de chamar o método
 
  const sortSpy = spyOn(videoService, 'getRecordSorted').and.returnValue(throwError({ status: 500 }));
  const consoleErrorSpy = spyOn(console, 'error');
 
  component.sortRecord(true);
 
  expect(sortSpy).toHaveBeenCalledWith('12345', true);
  expect(consoleErrorSpy).toHaveBeenCalledWith('Error sorting record:', { status: 500 });
});


 
});
