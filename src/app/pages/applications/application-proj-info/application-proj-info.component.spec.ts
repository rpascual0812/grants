import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProjInfoComponent } from './application-proj-info.component';

describe('ApplicationProjInfoComponent', () => {
  let component: ApplicationProjInfoComponent;
  let fixture: ComponentFixture<ApplicationProjInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationProjInfoComponent]
    });
    fixture = TestBed.createComponent(ApplicationProjInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
