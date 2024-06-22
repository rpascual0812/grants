import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThematicAreasDonorsComponent } from './thematic-areas-donors.component';

describe('ThematicAreasDonorsComponent', () => {
  let component: ThematicAreasDonorsComponent;
  let fixture: ComponentFixture<ThematicAreasDonorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThematicAreasDonorsComponent]
    });
    fixture = TestBed.createComponent(ThematicAreasDonorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
