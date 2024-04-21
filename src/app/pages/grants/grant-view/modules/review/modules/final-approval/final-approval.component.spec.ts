import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApprovalComponent } from './final-approval.component';

describe('FinalApprovalComponent', () => {
  let component: FinalApprovalComponent;
  let fixture: ComponentFixture<FinalApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalApprovalComponent]
    });
    fixture = TestBed.createComponent(FinalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
