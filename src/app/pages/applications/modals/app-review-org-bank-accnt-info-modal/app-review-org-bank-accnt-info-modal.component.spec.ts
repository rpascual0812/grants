import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReviewOrgBankAccntInfoModalComponent } from './app-review-org-bank-accnt-info-modal.component';

describe('AppReviewOrgBankAccntInfoModalComponent', () => {
  let component: AppReviewOrgBankAccntInfoModalComponent;
  let fixture: ComponentFixture<AppReviewOrgBankAccntInfoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppReviewOrgBankAccntInfoModalComponent]
    });
    fixture = TestBed.createComponent(AppReviewOrgBankAccntInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
