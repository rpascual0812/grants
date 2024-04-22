import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingReleaseTrancheModalComponent } from './funding-release-tranche-modal.component';

describe('FundingReleaseTrancheModalComponent', () => {
  let component: FundingReleaseTrancheModalComponent;
  let fixture: ComponentFixture<FundingReleaseTrancheModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingReleaseTrancheModalComponent]
    });
    fixture = TestBed.createComponent(FundingReleaseTrancheModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
