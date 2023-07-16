import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    private router: Router,
  ) { }

  isActive(type: any) {
    if (this.router.url.includes(type)) {
        return 'active';
    }
    return '';
  }
}
