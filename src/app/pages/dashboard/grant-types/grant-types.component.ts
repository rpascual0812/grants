import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces/_project.interface';
import { ToastrService } from 'ngx-toastr';
import { GRANT_CLOSING_STATUS } from 'src/app/utilities/constants';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

@Component({
    selector: 'app-grant-types',
    templateUrl: './grant-types.component.html',
    styleUrls: ['./grant-types.component.scss'],
})
export class GrantTypesComponent implements OnInit {
    // Bar Chart
    public barChartType = 'bar' as const;
    grantTypeIcons = [
        '../../../assets/images/chart-image-coin-stacked.png',
        '../../../assets/images/chart-image-bag-of-money.png',
        '../../../assets/images/chart-image-packages.png',
    ].map((png) => {
        const image = new Image();
        image.src = png;
        return image;
    });

    @ViewChild(BaseChartDirective) horizontalBarChart: BaseChartDirective<'bar'> | undefined;
    public horizontalBarChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                color: 'white',
                font: {
                    size: 14,
                },
                anchor: 'end',
                align: 'start',
                formatter: (_value, ctx) => {
                    const idx = ctx?.dataIndex;
                    const value = Number(ctx.dataset.data[idx]) ?? 0;
                    if (value !== 0) {
                        return `${value} USD`;
                    }
                    return '';
                },
                labels: {
                    value: {
                        anchor: 'center',
                        align: 'center',
                        formatter: (_value, ctx) => {
                            const description = [`$500 - $9,999`, `$10,000 - $30,000`, `$30,000 above`];
                            const datasetLabel = ctx?.dataset?.label;
                            const idx = ctx?.dataIndex;
                            const value = Number(ctx.dataset.data[idx]) ?? 0;
                            if (datasetLabel === 'Cumulative Grants') {
                                return '';
                            }

                            if (datasetLabel === 'Current Grants' && value !== 0) {
                                return description[idx] ?? '';
                            }
                            return '';
                        },
                    },
                    name: {
                        color: (ctx) => {
                            const chartLabel = ctx.dataset.label;
                            if (chartLabel === 'Cumulative Grants') {
                                return 'black';
                            }
                            return 'white';
                        },
                    },
                },
            },
        },
        scales: {
            x: {
                beforeFit: (axis) => {
                    const hightestValue = this.cumulativeGrants?.sort((a, b) => b - a).at(0) ?? 100;
                    axis.max = hightestValue + 30;
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                    callback: (tickValue, _index, _ticks) => {
                        return `${tickValue} USD`;
                    },
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    public horizontalBarChartData: ChartData<'bar'> = {
        labels: ['Micro grant', 'Small grant', 'Medium grant'],
        datasets: [
            {
                label: `Current Grants`,
                backgroundColor: [`rgb(26 115 232)`, `rgb(76 175 80) `, `rgb(26 35 126)`],
                data: [],
                barThickness: 500,
                borderSkipped: false,
            },
            {
                label: `Cumulative Grants`,
                data: [],
                barThickness: 500,
                borderSkipped: false,
            },
        ],
    };

    public horizontalBarChartPlugins = [
        ChartDataLabels,
        {
            id: 'barPlugins',
            afterDraw: (chart: Chart<'bar'>) => {
                const ctx = chart.ctx;
                const yAxis = chart.scales['y'];

                yAxis.ticks.forEach((_value: unknown, index: number) => {
                    const currentGrantValue = this.currentGrants[index];
                    const cumulativeGrantsValue = this.cumulativeGrants[index];
                    const y = yAxis.getPixelForTick(index);
                    if (cumulativeGrantsValue !== 0 && currentGrantValue !== 0) {
                        ctx.drawImage(this.grantTypeIcons[index], yAxis.right + 30, y - 25, 50, 50);
                    }
                });
            },
        },
    ];

    currentGrants: number[] = [];
    cumulativeGrants: number[] = [];
    loading = true;
    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.projectService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data as Project[];
                if (status) {
                    const activeProjects = data?.filter((proj) => proj.status !== null) ?? [];
                    const { microGrants, smallGrants, mediumGrants } = this.getGrantTypes(activeProjects);

                    const activeMicroGrants = this.getTotalGrantTypeTotalBudget(microGrants, 'active');
                    const closedMicroGrants = this.getTotalGrantTypeTotalBudget(microGrants, 'closed');
                    const currentMicroGrants = activeMicroGrants.toFixed(2);
                    const cumulativeMicroGrants = (activeMicroGrants + closedMicroGrants).toFixed(2);

                    const activeSmallGrants = this.getTotalGrantTypeTotalBudget(smallGrants, 'active');
                    const closedSmallGrants = this.getTotalGrantTypeTotalBudget(smallGrants, 'closed');
                    const currentSmallGrants = activeSmallGrants.toFixed(2);
                    const cumulativeSmallGrants = (activeSmallGrants + closedSmallGrants).toFixed(2);

                    const activeMediumGrants = this.getTotalGrantTypeTotalBudget(mediumGrants, 'active');
                    const closedMediumGrants = this.getTotalGrantTypeTotalBudget(mediumGrants, 'closed');
                    const currentMediumGrants = activeMediumGrants.toFixed(2);
                    const cumulativeMediumGrants = (activeMediumGrants + closedMediumGrants).toFixed(2);

                    this.currentGrants = [+currentMicroGrants, +currentSmallGrants, +currentMediumGrants];
                    this.cumulativeGrants = [+cumulativeMicroGrants, +cumulativeSmallGrants, +cumulativeMediumGrants];

                    this.horizontalBarChartData.datasets = [
                        {
                            label: `Current Grants`,
                            backgroundColor: [`rgb(26 115 232)`, `rgb(76 175 80) `, `rgb(26 35 126)`],
                            data: this.currentGrants,
                            barThickness: 70,
                            borderSkipped: false,
                        },
                        {
                            label: `Cumulative Grants`,
                            data: this.cumulativeGrants,
                            barThickness: 70,
                            borderSkipped: false,
                        },
                    ];

                    this.horizontalBarChart?.update();
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    getGrantTypes(projects: Project[]) {
        const microGrants = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof parsedBudgetRequestUsd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd < 10000;
            }
            return false;
        });

        const smallGrants = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof proj?.project_proposal?.budget_request_usd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd >= 10000 && parsedBudgetRequestUsd <= 30000;
            }
            return false;
        });

        const mediumGrants = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof parsedBudgetRequestUsd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd > 30000;
            }
            return false;
        });

        return {
            microGrants,
            smallGrants,
            mediumGrants,
        };
    }

    getTotalGrantTypeTotalBudget(projects: Project[], type: 'active' | 'closed') {
        let total = 0;
        if (type === 'active') {
            projects.forEach((proj) => {
                if (proj.status && proj.closing_status !== GRANT_CLOSING_STATUS.completed) {
                    total += isNaN(Number(proj.project_proposal?.budget_request_usd))
                        ? 0
                        : Number(proj.project_proposal?.budget_request_usd);
                }
            });
            return total;
        }

        projects.forEach((proj) => {
            if (proj.status && proj.closing_status === GRANT_CLOSING_STATUS.completed) {
                total += isNaN(Number(proj.project_proposal?.budget_request_usd))
                    ? 0
                    : Number(proj.project_proposal?.budget_request_usd);
            }
        });
        return total;
    }
}
