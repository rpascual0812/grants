import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueTranchesComponent } from './overdue-tranches.component';

describe('OverdueTranchesComponent', () => {
  let component: OverdueTranchesComponent;
  let fixture: ComponentFixture<OverdueTranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverdueTranchesComponent]
    });
    fixture = TestBed.createComponent(OverdueTranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
