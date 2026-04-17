import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDangerComponent } from './partner-danger.component';

describe('PartnerDangerComponent', () => {
  let component: PartnerDangerComponent;
  let fixture: ComponentFixture<PartnerDangerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerDangerComponent]
    });
    fixture = TestBed.createComponent(PartnerDangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
