import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router'; 
import { YourUnBTVComponent } from './your-unbtv.component';

describe('YourUnBTVComponent', () => {
  let component: YourUnBTVComponent;
  let fixture: ComponentFixture<YourUnBTVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourUnBTVComponent ],
      imports: [ RouterModule.forRoot([]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourUnBTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
