import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordComponent } from './record.component';
import { VideoService } from 'src/app/services/video.service';

describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RecordComponent],
      providers: [VideoService],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
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
});
