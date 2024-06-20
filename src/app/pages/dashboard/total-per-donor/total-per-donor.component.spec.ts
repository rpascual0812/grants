import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPerDonorComponent } from './total-per-donor.component';

describe('TotalPerDonorComponent', () => {
  let component: TotalPerDonorComponent;
  let fixture: ComponentFixture<TotalPerDonorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalPerDonorComponent]
    });
    fixture = TestBed.createComponent(TotalPerDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
