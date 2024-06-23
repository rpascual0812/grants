import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrancheReleasesComponent } from './tranche-releases.component';

describe('TrancheReleasesComponent', () => {
  let component: TrancheReleasesComponent;
  let fixture: ComponentFixture<TrancheReleasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrancheReleasesComponent]
    });
    fixture = TestBed.createComponent(TrancheReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
