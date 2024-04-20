import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjInfoViewComponent } from './proj-info-view.component';

describe('ProjInfoViewComponent', () => {
  let component: ProjInfoViewComponent;
  let fixture: ComponentFixture<ProjInfoViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjInfoViewComponent]
    });
    fixture = TestBed.createComponent(ProjInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
