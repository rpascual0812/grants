import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesAndTimelineViewComponent } from './activities-and-timeline-view.component';

describe('ActivitiesAndTimelineViewComponent', () => {
  let component: ActivitiesAndTimelineViewComponent;
  let fixture: ComponentFixture<ActivitiesAndTimelineViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesAndTimelineViewComponent]
    });
    fixture = TestBed.createComponent(ActivitiesAndTimelineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
