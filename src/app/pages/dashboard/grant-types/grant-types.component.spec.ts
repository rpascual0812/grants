import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTypesComponent } from './grant-types.component';

describe('GrantTypeChartsComponent', () => {
  let component: GrantTypesComponent;
  let fixture: ComponentFixture<GrantTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantTypesComponent]
    });
    fixture = TestBed.createComponent(GrantTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
