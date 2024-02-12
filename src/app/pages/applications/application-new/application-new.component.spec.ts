import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationNewComponent } from './application-new.component';

describe('ApplicationNewComponent', () => {
  let component: ApplicationNewComponent;
  let fixture: ComponentFixture<ApplicationNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationNewComponent]
    });
    fixture = TestBed.createComponent(ApplicationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
