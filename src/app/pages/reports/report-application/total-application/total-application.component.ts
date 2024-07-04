import { Component } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-total-application',
    templateUrl: './total-application.component.html',
    styleUrls: ['./total-application.component.scss']
})
export class TotalApplicationComponent {

    applications: any = [];
    totalApplications: any = {};
    total: number = 0;

    dateRange: number[] = [];

    refresh(applications: any, dateRange: any) {
        this.applications = applications;
        this.dateRange = dateRange;

        this.process();
    }

    process() {
        this.reset();
        this.applications.forEach((application: any) => {
            const date_created = DateTime.fromISO(application.date_created).toFormat('yyyy');
            if (!this.totalApplications[date_created]) {
                this.totalApplications[date_created] = 0;
            }
            this.totalApplications[date_created]++;
            this.total++;
        });
    }

    reset() {
        this.totalApplications = {};
        this.total = 0;
    }
}
