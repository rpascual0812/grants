import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGgfComponent } from './report-ggf.component';

describe('ReportGgfComponent', () => {
  let component: ReportGgfComponent;
  let fixture: ComponentFixture<ReportGgfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportGgfComponent]
    });
    fixture = TestBed.createComponent(ReportGgfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
