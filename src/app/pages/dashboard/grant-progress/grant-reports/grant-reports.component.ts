import { Component, Input, OnInit } from '@angular/core';
import * as _ from '../../../../utilities/globals';

@Component({
    selector: 'app-grant-reports',
    templateUrl: './grant-reports.component.html',
    styleUrls: ['./grant-reports.component.scss']
})
export class GrantReportsComponent implements OnInit {
    url: String = _.BASE_URL;
    @Input() project: any;

    interim_narrative_number: number = 0;
    interim_financial_number: number = 0;
    final_narrative_number: number = 0;
    final_financial_number: number = 0;

    interim_narrative_download: string = '';
    interim_financial_download: string = '';
    final_narrative_download: string = '';
    final_financial_download: string = '';

    ngOnInit(): void {
        this.project?.project_funding.forEach((funding: any, index: number) => {
            funding.project_funding_report.forEach((report: any) => {
                if (report.title == 'interim narrative report') {
                    this.interim_narrative_number = index + 1;
                    this.interim_narrative_download = funding?.bank_receipt_document?.path;
                }
                if (report.title == 'interim financial report') {
                    this.interim_financial_number = index + 1;
                }
                if (report.title == 'final narrative report') {
                    this.final_narrative_number = index + 1;
                }
                if (report.title == 'final financial report') {
                    this.final_financial_number = index + 1;
                }
            });
        });
    }
}
