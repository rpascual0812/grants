import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-grant-assessment',
    templateUrl: './grant-assessment.component.html',
    styleUrls: ['./grant-assessment.component.scss']
})
export class GrantAssessmentComponent implements OnInit {
    @Input() project: any;
    donors: any = [];

    ngOnInit(): void {
        this.project?.project_funding!.forEach((funding: any) => {
            if (!this.donors.includes(funding.donor.name)) {
                this.donors.push(funding.donor.name);
            }
        });
    }
}
