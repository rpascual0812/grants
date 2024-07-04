import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationBudgetComponent } from './application-budget.component';

describe('ApplicationBudgetComponent', () => {
  let component: ApplicationBudgetComponent;
  let fixture: ComponentFixture<ApplicationBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationBudgetComponent]
    });
    fixture = TestBed.createComponent(ApplicationBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
