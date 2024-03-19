import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantApplicationComponent } from './grant-application.component';

describe('GrantApplicationComponent', () => {
  let component: GrantApplicationComponent;
  let fixture: ComponentFixture<GrantApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantApplicationComponent]
    });
    fixture = TestBed.createComponent(GrantApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
