import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

type GrantPerYearItem = {
    date_created: string;
    total: string | number;
};

interface TotalGrantsPerCurrentYear {
    labels: GrantPerYearItem['date_created'][];
    data: number[];
    totalSum: number;
}

@Component({
    selector: 'app-total-grants-per-year',
    templateUrl: './total-grants-per-year.component.html',
    styleUrls: ['./total-grants-per-year.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TotalGrantsPerYearComponent implements OnInit {
    loading = true;
    currentDate = DateTime.now().toISODate();
    totalGrantsPerCurrentYear: TotalGrantsPerCurrentYear | null = null;

    @ViewChild(BaseChartDirective) pieChart: BaseChartDirective | undefined;

    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        layout: {
            autoPadding: true,
        },
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    pointStyle: 'circle',
                    usePointStyle: true,
                    font: {
                        size: 16,
                    },
                },
            },
            datalabels: {
                clamp: true,
                offset: -100,
                anchor: 'end',
                align: 'end',
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 16,
                },
            },
        },
    };

    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    };

    public pieChartPlugins = [ChartDataLabels];
    public pieChartType: ChartType = 'pie';

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    transformTotalGrantsPerYear(groupProjectDateCreated: GrantPerYearItem[]): TotalGrantsPerCurrentYear {
        const totalSum = groupProjectDateCreated.reduce((acc, item) => {
            acc += Number(item?.total ?? 0);
            return acc;
        }, 0);
        const labels: string[] = [];
        const data: number[] = [];
        groupProjectDateCreated.forEach((project) => {
            const total = Number(project?.total ?? 0);
            const label = DateTime.fromISO(project?.date_created).toFormat('y');
            const percentage = ((total / totalSum) * 100).toFixed(2);
            labels.push(`${label}  ${percentage}%`);
            data.push(Number(percentage));
        });
        return {
            labels,
            data,
            totalSum,
        };
    }

    fetch() {
        this.projectService
            .fetchGroupProjectDateCreated({
                to_date: this.currentDate as string,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.totalGrantsPerCurrentYear = this.transformTotalGrantsPerYear(data);
                        this.pieChartData.labels = this.totalGrantsPerCurrentYear.labels;
                        this.pieChartData.datasets = [
                            {
                                data: this.totalGrantsPerCurrentYear.data,
                            },
                        ];
                        this.pieChart?.update();
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Total Grants per Year. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Total Grants per Year. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading = false;
                },
            });
    }
}
