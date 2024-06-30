import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFggComponent } from './report-fgg.component';

describe('ReportFggComponent', () => {
  let component: ReportFggComponent;
  let fixture: ComponentFixture<ReportFggComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportFggComponent]
    });
    fixture = TestBed.createComponent(ReportFggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
