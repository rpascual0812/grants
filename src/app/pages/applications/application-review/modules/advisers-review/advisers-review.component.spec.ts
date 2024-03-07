import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisersReviewComponent } from './advisers-review.component';

describe('AdvisersReviewComponent', () => {
  let component: AdvisersReviewComponent;
  let fixture: ComponentFixture<AdvisersReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisersReviewComponent]
    });
    fixture = TestBed.createComponent(AdvisersReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
