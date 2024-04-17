import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapdevComponent } from './capdev.component';

describe('CapdevComponent', () => {
  let component: CapdevComponent;
  let fixture: ComponentFixture<CapdevComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapdevComponent]
    });
    fixture = TestBed.createComponent(CapdevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
