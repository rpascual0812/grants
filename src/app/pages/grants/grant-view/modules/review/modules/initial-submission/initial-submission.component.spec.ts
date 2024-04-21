import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialSubmissionComponent } from './initial-submission.component';

describe('InitialSubmissionComponent', () => {
  let component: InitialSubmissionComponent;
  let fixture: ComponentFixture<InitialSubmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitialSubmissionComponent]
    });
    fixture = TestBed.createComponent(InitialSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
