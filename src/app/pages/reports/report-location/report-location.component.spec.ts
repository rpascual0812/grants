import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLocationComponent } from './report-location.component';

describe('ReportLocationComponent', () => {
  let component: ReportLocationComponent;
  let fixture: ComponentFixture<ReportLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportLocationComponent]
    });
    fixture = TestBed.createComponent(ReportLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
