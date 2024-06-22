import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCountComponent } from './status-count.component';

describe('StatusCountComponent', () => {
  let component: StatusCountComponent;
  let fixture: ComponentFixture<StatusCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusCountComponent]
    });
    fixture = TestBed.createComponent(StatusCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
