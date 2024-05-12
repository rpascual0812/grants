import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGrantsPerYearComponent } from './total-grants-per-year.component';

describe('TotalGrantsPerYearComponent', () => {
  let component: TotalGrantsPerYearComponent;
  let fixture: ComponentFixture<TotalGrantsPerYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalGrantsPerYearComponent]
    });
    fixture = TestBed.createComponent(TotalGrantsPerYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
