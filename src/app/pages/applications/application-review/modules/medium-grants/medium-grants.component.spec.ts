import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumGrantsComponent } from './medium-grants.component';

describe('MediumGrantsComponent', () => {
  let component: MediumGrantsComponent;
  let fixture: ComponentFixture<MediumGrantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediumGrantsComponent]
    });
    fixture = TestBed.createComponent(MediumGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
