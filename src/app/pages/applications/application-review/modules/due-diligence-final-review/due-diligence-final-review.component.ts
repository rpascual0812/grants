import { Component, Input } from '@angular/core';
import { ApplicationRead } from 'src/app/interfaces/application.interface';

@Component({
  selector: 'app-due-diligence-final-review',
  templateUrl: './due-diligence-final-review.component.html',
  styleUrls: ['./due-diligence-final-review.component.scss']
})
export class DueDiligenceFinalReviewComponent {
  @Input() currentApplication: ApplicationRead | null
}
