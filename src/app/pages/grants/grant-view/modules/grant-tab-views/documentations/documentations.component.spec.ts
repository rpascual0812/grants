import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationsComponent } from './documentations.component';

describe('DocumentationsComponent', () => {
  let component: DocumentationsComponent;
  let fixture: ComponentFixture<DocumentationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationsComponent]
    });
    fixture = TestBed.createComponent(DocumentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
