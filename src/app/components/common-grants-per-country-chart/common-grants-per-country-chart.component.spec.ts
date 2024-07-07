import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonGrantsPerCountryChartComponent } from './common-grants-per-country-chart.component';

describe('CommonGrantsPerCountryChartComponent', () => {
  let component: CommonGrantsPerCountryChartComponent;
  let fixture: ComponentFixture<CommonGrantsPerCountryChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonGrantsPerCountryChartComponent]
    });
    fixture = TestBed.createComponent(CommonGrantsPerCountryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
