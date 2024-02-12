import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachDocumentsComponent } from './attach-documents.component';

describe('AttachDocumentsComponent', () => {
  let component: AttachDocumentsComponent;
  let fixture: ComponentFixture<AttachDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachDocumentsComponent]
    });
    fixture = TestBed.createComponent(AttachDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
