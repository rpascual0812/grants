import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AttendeesComponent {
  currentExpandedIdx = -1
  mockRandomEvent: number[] = []
  constructor() {
    for(let i = 0; i < 10; i++) {
      this.mockRandomEvent.push(i)
    }
  }
  handleIsOpenChange($event: boolean, idx: number) {
    if ($event) {
      this.currentExpandedIdx = idx
    } else {
      this.currentExpandedIdx = -1
    }
  }
}
