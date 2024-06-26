import { Component, Input, OnInit } from '@angular/core';
import { ProjectFunding } from 'src/app/interfaces/_project.interface';

@Component({
    selector: 'app-tranche-releases',
    templateUrl: './tranche-releases.component.html',
    styleUrls: ['./tranche-releases.component.scss']
})
export class TrancheReleasesComponent implements OnInit {
    @Input() project: any;
    amount_usd: number = 0;
    amount_other: any = [];


    interim_narrative: boolean = false;
    interim_financial: boolean = false;
    final_narrative: boolean = false;
    final_financial: boolean = false;

    ngOnInit(): void {
        this.project.project_funding.forEach((funding: any) => {
            this.amount_usd += parseFloat(funding.released_amount_usd);
            this.amount_other.push({
                currency: funding.released_amount_other_currency,
                amount: funding.released_amount_other
            });

            // check funding report
            funding.project_funding_report.forEach((report: any) => {
                if (report.title == 'interim narrative report') {
                    this.interim_narrative = true;
                }
                if (report.title == 'interim financial report') {
                    this.interim_financial = true;
                }
                if (report.title == 'final narrative report') {
                    this.final_narrative = true;
                }
                if (report.title == 'final financial report') {
                    this.final_financial = true;
                }
            });
        });
    }

    getInterimNarrative(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'interim narrative report');
        return report!.length > 0 ? true : false;
    }

    getInterimFinancial(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'interim financial report');
        return report!.length > 0 ? true : false;
    }

    getFinalNarrative(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'final narrative report');
        return report!.length > 0 ? true : false;
    }

    getFinalFinancial(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'final financial report');
        return report!.length > 0 ? true : false;
    }
}
