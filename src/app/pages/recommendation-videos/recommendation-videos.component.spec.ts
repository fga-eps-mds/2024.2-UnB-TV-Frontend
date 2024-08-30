import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationVideosComponent } from './recommendation-videos.component';

describe('RecommendationVideosComponent', () => {
  let component: RecommendationVideosComponent;
  let fixture: ComponentFixture<RecommendationVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendationVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
