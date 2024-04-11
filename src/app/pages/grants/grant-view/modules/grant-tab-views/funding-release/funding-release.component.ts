import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-funding-release',
  templateUrl: './funding-release.component.html',
  styleUrls: ['./funding-release.component.scss']
})
export class FundingReleaseComponent {
  @Input() test: string
}
