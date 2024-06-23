import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tranche-releases',
    templateUrl: './tranche-releases.component.html',
    styleUrls: ['./tranche-releases.component.scss']
})
export class TrancheReleasesComponent implements OnInit {
    @Input() project: any;
    amount_usd: number = 0;
    amount_other: any = [];

    total_tranches: number = 0;
    total_tranches_other_obj: any = {};
    total_tranches_other: any = [];

    approved_tranches_count: number = 0;
    grantee_acknowledgement: boolean = false;
    official_receipt: boolean = false;

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

            this.total_tranches += funding.released_amount_usd;
            if (!this.total_tranches_other_obj[funding.released_amount_other_currency]) {
                this.total_tranches_other_obj[funding.released_amount_other_currency] = 0;
            }
            this.total_tranches_other_obj[funding.released_amount_other_currency] += parseFloat(funding.released_amount_other);

            //check if approved
            funding.project_funding_report.forEach((report: any) => {
                if (report.status == 'approved') {
                    this.approved_tranches_count++;
                }
            });

            //check if acknowledged
            if (funding.grantee_acknowledgement) {
                this.grantee_acknowledgement = true;
            }

            //check if there is an official receipt
            if (funding.hasOwnProperty('bank_receipt_document') && funding.bank_receipt_document) {
                this.official_receipt = true;
            }

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

        const other_currencies = Object.keys(this.total_tranches_other_obj);
        other_currencies.forEach((currency: any) => {
            this.total_tranches_other.push({
                currency: currency,
                amount: this.total_tranches_other_obj[currency]
            });
        });
    }
}
