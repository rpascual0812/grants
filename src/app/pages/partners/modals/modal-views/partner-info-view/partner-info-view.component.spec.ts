import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInfoViewComponent } from './partner-info-view.component';

describe('PartnerInfoViewComponent', () => {
  let component: PartnerInfoViewComponent;
  let fixture: ComponentFixture<PartnerInfoViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerInfoViewComponent]
    });
    fixture = TestBed.createComponent(PartnerInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
