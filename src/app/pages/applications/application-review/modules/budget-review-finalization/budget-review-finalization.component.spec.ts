import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReviewFinalizationComponent } from './budget-review-finalization.component';

describe('BudgetReviewFinalizationComponent', () => {
  let component: BudgetReviewFinalizationComponent;
  let fixture: ComponentFixture<BudgetReviewFinalizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetReviewFinalizationComponent]
    });
    fixture = TestBed.createComponent(BudgetReviewFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
