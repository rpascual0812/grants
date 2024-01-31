import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposedActivitiesTimelinesComponent } from './proposed-activities-timelines.component';

describe('ProposedActivitiesTimelinesComponent', () => {
  let component: ProposedActivitiesTimelinesComponent;
  let fixture: ComponentFixture<ProposedActivitiesTimelinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposedActivitiesTimelinesComponent]
    });
    fixture = TestBed.createComponent(ProposedActivitiesTimelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
