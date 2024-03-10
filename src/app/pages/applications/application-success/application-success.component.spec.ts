import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSuccessComponent } from './application-success.component';

describe('ApplicationSuccessComponent', () => {
  let component: ApplicationSuccessComponent;
  let fixture: ComponentFixture<ApplicationSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationSuccessComponent]
    });
    fixture = TestBed.createComponent(ApplicationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
