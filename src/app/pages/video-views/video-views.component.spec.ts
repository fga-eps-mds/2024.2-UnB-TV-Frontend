import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoViewsComponent } from './video-views.component';

describe('VideoViewsComponent', () => {
  let component: VideoViewsComponent;
  let fixture: ComponentFixture<VideoViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
