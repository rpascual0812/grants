import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantClosingComponent } from './grant-closing.component';

describe('GrantClosingComponent', () => {
  let component: GrantClosingComponent;
  let fixture: ComponentFixture<GrantClosingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantClosingComponent]
    });
    fixture = TestBed.createComponent(GrantClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
