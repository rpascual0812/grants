import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPreparationComponent } from './contract-preparation.component';

describe('ContractPreparationComponent', () => {
  let component: ContractPreparationComponent;
  let fixture: ComponentFixture<ContractPreparationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractPreparationComponent]
    });
    fixture = TestBed.createComponent(ContractPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
