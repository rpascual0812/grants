import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantsTeamReviewComponent } from './grants-team-review.component';

describe('GrantsTeamReviewComponent', () => {
  let component: GrantsTeamReviewComponent;
  let fixture: ComponentFixture<GrantsTeamReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantsTeamReviewComponent]
    });
    fixture = TestBed.createComponent(GrantsTeamReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
