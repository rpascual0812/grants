import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFinalizationComponent } from './contract-finalization.component';

describe('ContractFinalizationComponent', () => {
  let component: ContractFinalizationComponent;
  let fixture: ComponentFixture<ContractFinalizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractFinalizationComponent]
    });
    fixture = TestBed.createComponent(ContractFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
