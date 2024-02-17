import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent {
  @Input() filter: Set<string>
  
  getCurrentSelectedFilter() {
    return Array.from(this.filter)
  }
}
