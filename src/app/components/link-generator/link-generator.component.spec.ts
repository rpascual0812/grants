import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGeneratorComponent } from './link-generator.component';

describe('LinkGeneratorComponent', () => {
  let component: LinkGeneratorComponent;
  let fixture: ComponentFixture<LinkGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkGeneratorComponent]
    });
    fixture = TestBed.createComponent(LinkGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
