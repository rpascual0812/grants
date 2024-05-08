import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGrantFunctionComponent } from './total-grant-function.component';

describe('TotalGrantFunctionComponent', () => {
  let component: TotalGrantFunctionComponent;
  let fixture: ComponentFixture<TotalGrantFunctionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalGrantFunctionComponent]
    });
    fixture = TestBed.createComponent(TotalGrantFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
