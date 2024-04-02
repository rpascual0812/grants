import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgBankAccountComponent } from './org-bank-account.component';

describe('OrgBankAccountComponent', () => {
  let component: OrgBankAccountComponent;
  let fixture: ComponentFixture<OrgBankAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgBankAccountComponent]
    });
    fixture = TestBed.createComponent(OrgBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
