import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialManagementCapacityComponent } from './financial-management-capacity.component';

describe('FinancialManagementCapacityComponent', () => {
  let component: FinancialManagementCapacityComponent;
  let fixture: ComponentFixture<FinancialManagementCapacityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialManagementCapacityComponent]
    });
    fixture = TestBed.createComponent(FinancialManagementCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
