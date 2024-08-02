import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IVideo } from 'src/shared/model/video.model';
import { Catalog } from 'src/shared/model/catalog.model';
import { FormsModule } from '@angular/forms';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let videoServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    videoServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({ body: { videoList: [] } })),
      videosCatalog: jasmine.createSpy('videosCatalog'),
      setVideosCatalog: jasmine.createSpy('setVideosCatalog')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ CatalogComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: VideoService, useValue: videoServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call findAll on init', () => {
    spyOn(component, 'findAll').and.callThrough();
    component.ngOnInit();
    expect(component.findAll).toHaveBeenCalled();
  });

  it('should populate videosEduplay and unbTvVideos on findAll success', () => {
    const videos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 2, name: 'other' }] }
    ];

    videoServiceMock.findAll.and.returnValue(of({ body: { videoList: videos } }));
    
    component.findAll();

    expect(component.videosEduplay.length).toBe(2);
    expect(component.videosEduplay[0].id).toBe(1);
  });

  it('should log error on findAll error', () => {
    spyOn(console, 'log');
    videoServiceMock.findAll.and.returnValue(throwError('Error'));

    component.findAll();

    expect(console.log).toHaveBeenCalledWith('Error');
  });

  it('should filter videos based on filterTitle', () => {
    component.unbTvVideos = [
      { id: 1, title: 'Angular', description: '', keywords: '', catalog: '' },
      { id: 2, title: 'React', description: '', keywords: '', catalog: '' }
    ];

    component.filterTitle = 'Angular';
    component.filterVideos();

    expect(component.filteredVideos).toEqual([component.unbTvVideos[0]]);
  });

  it('should navigate to /videos on program click', () => {
    const videos: IVideo[] = [{ id: 1, title: 'Video 1', channels: [] }];
    component.onProgramClick(videos);
    expect(videoServiceMock.setVideosCatalog).toHaveBeenCalledWith(videos);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videos']);
  });
});
