import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantsListComponent } from './grants-list.component';

describe('GrantsListComponent', () => {
  let component: GrantsListComponent;
  let fixture: ComponentFixture<GrantsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantsListComponent]
    });
    fixture = TestBed.createComponent(GrantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
