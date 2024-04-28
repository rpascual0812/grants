import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesModalComponent } from './attendees-modal.component';

describe('AttendeesModalComponent', () => {
  let component: AttendeesModalComponent;
  let fixture: ComponentFixture<AttendeesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendeesModalComponent]
    });
    fixture = TestBed.createComponent(AttendeesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
