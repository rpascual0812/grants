import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonProfitEquivalencyDeterminationComponent } from './non-profit-equivalency-determination.component';

describe('NonProfitEquivalencyDeterminationComponent', () => {
  let component: NonProfitEquivalencyDeterminationComponent;
  let fixture: ComponentFixture<NonProfitEquivalencyDeterminationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonProfitEquivalencyDeterminationComponent]
    });
    fixture = TestBed.createComponent(NonProfitEquivalencyDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
