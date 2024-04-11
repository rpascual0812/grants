import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingReleaseComponent } from './funding-release.component';

describe('FundingReleaseComponent', () => {
  let component: FundingReleaseComponent;
  let fixture: ComponentFixture<FundingReleaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingReleaseComponent]
    });
    fixture = TestBed.createComponent(FundingReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
