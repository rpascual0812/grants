import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatePreviewComponent } from './email-template-preview.component';

describe('EmailTemplatePreviewComponent', () => {
  let component: EmailTemplatePreviewComponent;
  let fixture: ComponentFixture<EmailTemplatePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailTemplatePreviewComponent]
    });
    fixture = TestBed.createComponent(EmailTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
