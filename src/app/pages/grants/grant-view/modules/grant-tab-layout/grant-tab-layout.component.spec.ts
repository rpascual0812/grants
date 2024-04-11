import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTabLayoutComponent } from './grant-tab-layout.component';

describe('GrantTabLayoutComponent', () => {
  let component: GrantTabLayoutComponent;
  let fixture: ComponentFixture<GrantTabLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantTabLayoutComponent]
    });
    fixture = TestBed.createComponent(GrantTabLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
