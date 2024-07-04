import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStatusesComponent } from './application-statuses.component';

describe('ApplicationStatusesComponent', () => {
  let component: ApplicationStatusesComponent;
  let fixture: ComponentFixture<ApplicationStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationStatusesComponent]
    });
    fixture = TestBed.createComponent(ApplicationStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
