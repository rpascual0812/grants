import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantReportsComponent } from './grant-reports.component';

describe('GrantReportsComponent', () => {
  let component: GrantReportsComponent;
  let fixture: ComponentFixture<GrantReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantReportsComponent]
    });
    fixture = TestBed.createComponent(GrantReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
