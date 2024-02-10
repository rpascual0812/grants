import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAuthComponent } from './application-auth.component';

describe('ApplicationAuthComponent', () => {
  let component: ApplicationAuthComponent;
  let fixture: ComponentFixture<ApplicationAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationAuthComponent]
    });
    fixture = TestBed.createComponent(ApplicationAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
