import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonProfitEquivalDeterViewComponent } from './non-profit-equival-deter-view.component';

describe('NonProfitEquivalDeterViewComponent', () => {
  let component: NonProfitEquivalDeterViewComponent;
  let fixture: ComponentFixture<NonProfitEquivalDeterViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonProfitEquivalDeterViewComponent]
    });
    fixture = TestBed.createComponent(NonProfitEquivalDeterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
