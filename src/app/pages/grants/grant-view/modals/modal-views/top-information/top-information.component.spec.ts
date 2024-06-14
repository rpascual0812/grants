import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInformationComponent } from './top-information.component';

describe('TopInformationComponent', () => {
  let component: TopInformationComponent;
  let fixture: ComponentFixture<TopInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopInformationComponent]
    });
    fixture = TestBed.createComponent(TopInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
