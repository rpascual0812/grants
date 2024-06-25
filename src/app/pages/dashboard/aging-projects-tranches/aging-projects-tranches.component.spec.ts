import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingProjectsTranchesComponent } from './aging-projects-tranches.component';

describe('AgingProjectsTranchesComponent', () => {
  let component: AgingProjectsTranchesComponent;
  let fixture: ComponentFixture<AgingProjectsTranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgingProjectsTranchesComponent]
    });
    fixture = TestBed.createComponent(AgingProjectsTranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
