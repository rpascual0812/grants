import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProponentInformationComponent } from './proponent-information.component';

describe('ProponentInformationComponent', () => {
  let component: ProponentInformationComponent;
  let fixture: ComponentFixture<ProponentInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProponentInformationComponent]
    });
    fixture = TestBed.createComponent(ProponentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
