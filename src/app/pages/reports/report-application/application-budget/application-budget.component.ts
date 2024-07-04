import { Component } from '@angular/core';
import { DateTime } from 'luxon';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-application-budget',
    templateUrl: './application-budget.component.html',
    styleUrls: ['./application-budget.component.scss']
})
export class ApplicationBudgetComponent {
    applications: any = [];
    total: number = 0;

    dateRange: number[] = [];

    filters: any = [];
    statusesTotals: any = {};

    public statusesChartLabels: any = [];

    public barChartLegend = true;
    public barChartPlugins = [];
    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: []
    };
    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        maintainAspectRatio: true,
        color: 'black',
        font: {
            size: 14,
        },
        responsive: false,
    };

    refresh(applications: any, dateRange: any) {
        this.applications = applications;
        this.dateRange = dateRange;

        this.updateFilters();
        this.process();
    }

    process() {
        this.resetFilters();
        this.applications.forEach((application: any) => {
            const date_created = DateTime.fromISO(application.date_created).toFormat('yyyy');

            this.filters.forEach((filter: any) => {
                if (application.project && application.project.type && filter.name == application.project.type.name) {
                    filter.dates[date_created]++;
                    if (!this.statusesTotals[filter.name]) {
                        this.statusesChartLabels.push(filter.name);
                        this.statusesTotals[filter.name] = 0;
                    }
                    this.statusesTotals[filter.name]++;
                }
            });
        });

        let statuses: any = [];
        let datasetsData: any = [];

        const statusesKeys = Object.keys(this.statusesTotals);
        statusesKeys.forEach((key: string) => {
            statuses.push(key);
            datasetsData.push(this.statusesTotals[key]);
        });
        this.barChartData = {
            labels: statuses,
            datasets: [
                {
                    data: datasetsData,
                    label: 'Status',
                    backgroundColor: [`rgb(33 69 129)`, `rgb(19 44 86)`, `rgb(0 77 206)`, `rgb(76 175 80)`, `rgb(59 94 97)`, `rgb(132 166 239)`, `rgb(252 194 3)`, `rgb(54 162 235)`],
                }
            ]
        };
    }

    reset() {

    }

    updateFilters() {
        this.applications.forEach((application: any) => {
            if (application.project && application.project.type) {
                const checkStatus = (obj: any) => obj.name === application.project.type.name;
                if (!this.filters.some(checkStatus)) {
                    if (application.project && application.project.type) {
                        this.filters.push({
                            name: application.project?.type?.name,
                            dates: {}
                        });
                    }
                }
            }

        });

        this.resetFilters();
    }

    resetFilters() {
        this.filters.forEach((filter: any) => {
            let dates: any = {};
            this.dateRange.forEach((date: any) => {
                dates[date] = 0;
            });

            filter.dates = dates;
        });

        this.statusesTotals = {};
    }
}
