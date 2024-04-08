import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorModalComponent } from './donor-modal.component';

describe('DonorModalComponent', () => {
  let component: DonorModalComponent;
  let fixture: ComponentFixture<DonorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonorModalComponent]
    });
    fixture = TestBed.createComponent(DonorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
