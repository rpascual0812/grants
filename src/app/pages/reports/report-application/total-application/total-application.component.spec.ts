import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalApplicationComponent } from './total-application.component';

describe('TotalApplicationComponent', () => {
  let component: TotalApplicationComponent;
  let fixture: ComponentFixture<TotalApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalApplicationComponent]
    });
    fixture = TestBed.createComponent(TotalApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
