import { Component, Input, OnInit } from '@angular/core';
import * as _ from '../../../../utilities/globals';
import { ProjectFunding } from 'src/app/interfaces/_project.interface';

@Component({
    selector: 'app-grant-reports',
    templateUrl: './grant-reports.component.html',
    styleUrls: ['./grant-reports.component.scss']
})
export class GrantReportsComponent implements OnInit {
    url: String = _.BASE_URL;
    @Input() project: any;

    ngOnInit(): void {

    }

    showInterimNarrative(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'interim narrative report');
        return report!.length > 0 ? true : false;
    }

    showInterimFinancial(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'interim financial report');
        return report!.length > 0 ? true : false;
    }

    showFinalNarrative(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'final narrative report');
        return report!.length > 0 ? true : false;
    }

    showFinalFinancial(funding: ProjectFunding) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == 'final financial report');
        return report!.length > 0 ? true : false;
    }

    getLink(funding: ProjectFunding, title: string) {
        const report = funding.project_funding_report?.filter((report: any) => report.title == title)[0];
        return report && report?.document ? this.url + '/' + report.document?.path : null;
    }
}
