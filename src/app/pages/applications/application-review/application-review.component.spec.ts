import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReviewComponent } from './application-review.component';

describe('ApplicationReviewComponent', () => {
  let component: ApplicationReviewComponent;
  let fixture: ComponentFixture<ApplicationReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationReviewComponent]
    });
    fixture = TestBed.createComponent(ApplicationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
