import { Component, Input, OnInit } from '@angular/core';
import { ApplicationRead } from 'src/app/interfaces/application.interface';

@Component({
  selector: 'app-advisers-review',
  templateUrl: './advisers-review.component.html',
  styleUrls: ['./advisers-review.component.scss']
})
export class AdvisersReviewComponent  implements OnInit {
    @Input() currentApplication: ApplicationRead | null

    ngOnInit() {}

}
