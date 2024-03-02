import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInformationComponent } from './partner-information.component';

describe('PartnerInformationComponent', () => {
  let component: PartnerInformationComponent;
  let fixture: ComponentFixture<PartnerInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerInformationComponent]
    });
    fixture = TestBed.createComponent(PartnerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
