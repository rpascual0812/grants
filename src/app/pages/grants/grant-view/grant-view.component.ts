import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-grant-view',
  templateUrl: './grant-view.component.html',
  styleUrls: ['./grant-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GrantViewComponent {
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
