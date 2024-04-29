import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBeneficiaryModalComponent } from './project-beneficiary-modal.component';

describe('ProjectBeneficiaryModalComponent', () => {
  let component: ProjectBeneficiaryModalComponent;
  let fixture: ComponentFixture<ProjectBeneficiaryModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectBeneficiaryModalComponent]
    });
    fixture = TestBed.createComponent(ProjectBeneficiaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
