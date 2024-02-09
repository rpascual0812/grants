import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-partner-view',
  templateUrl: './partner-view.component.html',
  styleUrls: ['./partner-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PartnerViewComponent {
  currentExpanded = new Set()

  handleIsOpenChange($event: boolean, section: string) {
    if ($event) {
      this.currentExpanded.add(section)
    } else {
      this.currentExpanded.delete(section)
    }

    console.log(this.currentExpanded)
  }

  handleOnEdit($event: MouseEvent, section: string) {
    $event.stopPropagation()
    console.log('section', section)
  }
}
