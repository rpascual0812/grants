import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantsForComponent } from './grants-for.component';

describe('GrantsForComponent', () => {
  let component: GrantsForComponent;
  let fixture: ComponentFixture<GrantsForComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantsForComponent]
    });
    fixture = TestBed.createComponent(GrantsForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
