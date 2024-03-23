import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesTimelineComponent } from './activities-timeline.component';

describe('ActivitiesTimelineComponent', () => {
  let component: ActivitiesTimelineComponent;
  let fixture: ComponentFixture<ActivitiesTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesTimelineComponent]
    });
    fixture = TestBed.createComponent(ActivitiesTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
