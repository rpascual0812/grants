import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgProfileViewComponent } from './org-profile-view.component';

describe('OrgProfileViewComponent', () => {
  let component: OrgProfileViewComponent;
  let fixture: ComponentFixture<OrgProfileViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgProfileViewComponent]
    });
    fixture = TestBed.createComponent(OrgProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
