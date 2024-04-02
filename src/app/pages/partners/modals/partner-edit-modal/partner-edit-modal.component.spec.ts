import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerEditModalComponent } from './partner-edit-modal.component';

describe('PartnerEditModalComponent', () => {
  let component: PartnerEditModalComponent;
  let fixture: ComponentFixture<PartnerEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerEditModalComponent]
    });
    fixture = TestBed.createComponent(PartnerEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
