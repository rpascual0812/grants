import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSigningComponent } from './partner-signing.component';

describe('PartnerSigningComponent', () => {
  let component: PartnerSigningComponent;
  let fixture: ComponentFixture<PartnerSigningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerSigningComponent]
    });
    fixture = TestBed.createComponent(PartnerSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
