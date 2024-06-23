import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantAssessmentComponent } from './grant-assessment.component';

describe('GrantAssessmentComponent', () => {
  let component: GrantAssessmentComponent;
  let fixture: ComponentFixture<GrantAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantAssessmentComponent]
    });
    fixture = TestBed.createComponent(GrantAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
