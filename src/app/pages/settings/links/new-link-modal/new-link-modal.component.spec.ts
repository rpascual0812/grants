import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLinkModalComponent } from './new-link-modal.component';

describe('NewLinkModalComponent', () => {
  let component: NewLinkModalComponent;
  let fixture: ComponentFixture<NewLinkModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewLinkModalComponent]
    });
    fixture = TestBed.createComponent(NewLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
