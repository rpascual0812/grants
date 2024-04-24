import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeadlineModalComponent } from './edit-deadline-modal.component';

describe('EditDeadlineModalComponent', () => {
  let component: EditDeadlineModalComponent;
  let fixture: ComponentFixture<EditDeadlineModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeadlineModalComponent]
    });
    fixture = TestBed.createComponent(EditDeadlineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
