import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingReleaseLiquidationModalComponent } from './funding-release-liquidation-modal.component';

describe('FundingReleaseLiquidationModalComponent', () => {
  let component: FundingReleaseLiquidationModalComponent;
  let fixture: ComponentFixture<FundingReleaseLiquidationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingReleaseLiquidationModalComponent]
    });
    fixture = TestBed.createComponent(FundingReleaseLiquidationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
