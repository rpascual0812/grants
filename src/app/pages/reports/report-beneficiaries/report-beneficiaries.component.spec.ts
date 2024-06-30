import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBeneficiariesComponent } from './report-beneficiaries.component';

describe('ReportBeneficiariesComponent', () => {
  let component: ReportBeneficiariesComponent;
  let fixture: ComponentFixture<ReportBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(ReportBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
