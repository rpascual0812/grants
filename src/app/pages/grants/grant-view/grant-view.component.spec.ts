import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantViewComponent } from './grant-view.component';

describe('GrantViewComponent', () => {
  let component: GrantViewComponent;
  let fixture: ComponentFixture<GrantViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantViewComponent]
    });
    fixture = TestBed.createComponent(GrantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
