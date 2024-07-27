import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivateComponent } from './admin-activate.component';

describe('AdminActivateComponent', () => {
  let component: AdminActivateComponent;
  let fixture: ComponentFixture<AdminActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminActivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
