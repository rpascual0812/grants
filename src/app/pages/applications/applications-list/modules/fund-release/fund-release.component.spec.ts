import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundReleaseComponent } from './fund-release.component';

describe('FundReleaseComponent', () => {
  let component: FundReleaseComponent;
  let fixture: ComponentFixture<FundReleaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundReleaseComponent]
    });
    fixture = TestBed.createComponent(FundReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
