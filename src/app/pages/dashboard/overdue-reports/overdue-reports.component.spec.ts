import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueReportsComponent } from './overdue-reports.component';

describe('OverdueReportsComponent', () => {
  let component: OverdueReportsComponent;
  let fixture: ComponentFixture<OverdueReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverdueReportsComponent]
    });
    fixture = TestBed.createComponent(OverdueReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
