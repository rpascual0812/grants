import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDiligenceFinalReviewComponent } from './due-diligence-final-review.component';

describe('DueDiligenceFinalReviewComponent', () => {
  let component: DueDiligenceFinalReviewComponent;
  let fixture: ComponentFixture<DueDiligenceFinalReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DueDiligenceFinalReviewComponent]
    });
    fixture = TestBed.createComponent(DueDiligenceFinalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
