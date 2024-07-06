import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { ApplicationService } from 'src/app/services/application.service';

import { TotalApplicationComponent } from './total-application/total-application.component';
import { ApplicationStatusesComponent } from './application-statuses/application-statuses.component';
import { ApplicationBudgetComponent } from './application-budget/application-budget.component';

@Component({
    selector: 'app-report-application',
    templateUrl: './report-application.component.html',
    styleUrls: ['./report-application.component.scss']
})
export class ReportApplicationComponent implements OnInit {

    @ViewChild(TotalApplicationComponent) totalApplications: TotalApplicationComponent;
    @ViewChild(ApplicationStatusesComponent) applicationStatuses: ApplicationStatusesComponent;
    @ViewChild(ApplicationBudgetComponent) applicationBudget: ApplicationBudgetComponent;

    months: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
    years: number[] = [];
    statuses: string[] = [
        'Received Proposals', 'Grants Team Review', 'Advisers Review', 'Budget Review and Finalization', 'Financial Management Capacity', 'Due Diligence (Medium Grants)', 'Approved', 'Rejected', 'Cancelled'
    ];

    applications: any = [];

    dates: any = {
        from: {
            month: '',
            year: ''
        },
        to: {
            month: '',
            year: ''
        }
    }

    dateRange: number[] = [];

    status: number | null = null;

    constructor(
        private applicationService: ApplicationService,
    ) {

    }

    ngOnInit() {
        let yearNow = parseInt(DateTime.now().toFormat('yyyy'));

        for (let i = 2000; i <= yearNow; i++) {
            this.years.push(i);
        }

        this.dates.from.year = yearNow;
        this.dates.to.year = yearNow;

        this.dates.from.month = DateTime.now().toFormat('MMMM');
        this.dates.to.month = DateTime.now().toFormat('MMMM');

        this.updateDates();
    }

    search() {
        this.fetch();
    }

    updateDates() {
        this.dateRange = [];
        for (let i = this.dates.from.year; i <= this.dates.to.year; i++) {
            this.dateRange.push(i);
        }

        this.fetch();
    }

    onChangeSelectedItem(ev: any) {
        this.status = ev.length > 0 ? ev[0] : null;
        this.fetch();
    }

    fetch() {
        const params = {
            date_from: this.dates.from.year + "-" + DateTime.fromFormat(this.dates.from.month, 'MMMM').toFormat('MM'),
            date_to: this.dates.to.year + "-" + DateTime.fromFormat(this.dates.to.month, 'MMMM').toFormat('MM'),
            status: this.status
        };

        this.applicationService
            .fetchReportApplications(params)
            .subscribe({
                next: (data: any) => {
                    this.applications = data.data;

                    if (this.applications) {
                        this.totalApplications.refresh(this.applications, this.dateRange);
                        this.applicationStatuses.refresh(this.applications, this.dateRange);
                        this.applicationBudget.refresh(this.applications, this.dateRange);
                    }
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }
}
