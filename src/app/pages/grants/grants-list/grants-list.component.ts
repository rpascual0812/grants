import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grants-list',
  templateUrl: './grants-list.component.html',
  styleUrls: ['./grants-list.component.scss']
})
export class GrantsListComponent {
  @Input() filter: string
}
