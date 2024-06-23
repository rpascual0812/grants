import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-grant-assessment',
    templateUrl: './grant-assessment.component.html',
    styleUrls: ['./grant-assessment.component.scss']
})
export class GrantAssessmentComponent {
    @Input() project: any;
}
