import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalSponsorInformationComponent } from './fiscal-sponsor-information.component';

describe('FiscalSponsorInformationComponent', () => {
  let component: FiscalSponsorInformationComponent;
  let fixture: ComponentFixture<FiscalSponsorInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiscalSponsorInformationComponent]
    });
    fixture = TestBed.createComponent(FiscalSponsorInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
