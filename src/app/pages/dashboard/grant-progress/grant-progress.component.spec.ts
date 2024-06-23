import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantProgressComponent } from './grant-progress.component';

describe('GrantProgressComponent', () => {
  let component: GrantProgressComponent;
  let fixture: ComponentFixture<GrantProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantProgressComponent]
    });
    fixture = TestBed.createComponent(GrantProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
