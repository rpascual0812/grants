import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReviewOtherInfoModalComponent } from './app-review-other-info-modal.component';

describe('AppReviewOtherInfoModalComponent', () => {
  let component: AppReviewOtherInfoModalComponent;
  let fixture: ComponentFixture<AppReviewOtherInfoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppReviewOtherInfoModalComponent]
    });
    fixture = TestBed.createComponent(AppReviewOtherInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
