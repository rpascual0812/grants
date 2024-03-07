import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReviewFiscalSponsorBankDetailModalComponent } from './app-review-fiscal-sponsor-bank-detail-modal.component';

describe('AppReviewFiscalSponsorBankDetailModalComponent', () => {
  let component: AppReviewFiscalSponsorBankDetailModalComponent;
  let fixture: ComponentFixture<AppReviewFiscalSponsorBankDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppReviewFiscalSponsorBankDetailModalComponent]
    });
    fixture = TestBed.createComponent(AppReviewFiscalSponsorBankDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
