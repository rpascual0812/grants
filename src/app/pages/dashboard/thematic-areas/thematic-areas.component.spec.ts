import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThematicAreasComponent } from './thematic-areas.component';

describe('ThematicAreasComponent', () => {
  let component: ThematicAreasComponent;
  let fixture: ComponentFixture<ThematicAreasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThematicAreasComponent]
    });
    fixture = TestBed.createComponent(ThematicAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
