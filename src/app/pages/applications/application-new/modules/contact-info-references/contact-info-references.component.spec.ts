import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoReferencesComponent } from './contact-info-references.component';

describe('ContactInfoReferencesComponent', () => {
  let component: ContactInfoReferencesComponent;
  let fixture: ComponentFixture<ContactInfoReferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactInfoReferencesComponent]
    });
    fixture = TestBed.createComponent(ContactInfoReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
