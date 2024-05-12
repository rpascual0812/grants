import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGrantsPerCountryComponent } from './total-grants-per-country.component';

describe('TotalGrantsPerCountryComponent', () => {
  let component: TotalGrantsPerCountryComponent;
  let fixture: ComponentFixture<TotalGrantsPerCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalGrantsPerCountryComponent]
    });
    fixture = TestBed.createComponent(TotalGrantsPerCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
