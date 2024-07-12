import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PartnerService } from 'src/app/services/partner.service';
import { ToastrService } from 'ngx-toastr';
import { Application, Partner } from 'src/app/interfaces/_application.interface';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantPerCountry } from 'src/app/components/common-grants-per-country-chart/common-grants-per-country-chart.component';
import { GRANT_CLOSING_STATUS } from 'src/app/utilities/constants';

interface PartnerList extends Partner {
    applications?: Application[];
}

interface SummaryTotalGrantsPerCountry {
    grantsPerCountry: GrantPerCountry[];
    overallTotal: number;
}

interface SummaryChart {
    label: string;
    data: number;
}

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    // Pie Chart
    @ViewChild(BaseChartDirective) pieChart: BaseChartDirective | undefined;
    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
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
                    size: 30,
                },
            },
        },
    };
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: ['Preparing for Project start up', 'Ongoing implementation', 'Mail Sales'],
        datasets: [
            {
                data: [16, 10, 64],
            },
        ],
    };
    public pieChartPlugins = [ChartDataLabels];
    public pieChartType: ChartType = 'pie';

    // Grants Applied Per Country Pie Chart
    @ViewChild(BaseChartDirective) grantsAppliedPerCountryChart: BaseChartDirective | undefined;
    public grantsAppliedPerCountryChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
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
                    size: 30,
                },
            },
        },
    };
    public grantsAppliedPerCountryChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    };
    public grantsAppliedPerCountryChartPlugins = [ChartDataLabels];
    public grantsAppliedPerCountryChartType: ChartType = 'pie';

    // Grants Per Type Pie Chart
    @ViewChild(BaseChartDirective) grantsPerTypeChart: BaseChartDirective | undefined;
    public grantsPerTypeChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
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
                    size: 30,
                },
            },
        },
    };
    public grantsPerTypeChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    };
    public grantsPerTypeChartPlugins = [ChartDataLabels];
    public grantsPerTypeChartType: ChartType = 'pie';

    // Grants Approved Per Country Pie Chart
    @ViewChild(BaseChartDirective) grantsApprovedPerCountryChart: BaseChartDirective | undefined;
    public grantsApprovedPerCountryChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
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
                    size: 30,
                },
            },
        },
    };
    public grantsApprovedPerCountryChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    };
    public grantsApprovedPerCountryChartPlugins = [ChartDataLabels];
    public grantsApprovedPerCountryChartType: ChartType = 'pie';

    @ViewChild(BaseChartDirective) barChart: BaseChartDirective<'bar'> | undefined;
    public barChartChartOptions: ChartConfiguration['options'] = {
        // We use these empty structures as placeholders for dynamic theming.
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                clamp: true,
                offset: -100,
                anchor: 'end',
                align: 'end',
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 18,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 14,
                    },
                    callback: (tickValue, index, ticks) => {
                        const label = this.barChartData.labels?.at(index) ?? '';
                        if (/\s/.test(label as string)) {
                            return (label as string)?.split(' ');
                        }
                        return label as string;
                    },
                },
            },
            y: {
                max: 1000,
                ticks: {
                    font: {
                        size: 18,
                    },
                },
            },
        },
    };
    public barChartData: ChartData<'bar'> = {
        labels: [
            'Climate related',
            'Indigenous',
            'Support and Recovery from Pandemic',
            'Unrestricted',
            'Disability Rights',
        ],
        datasets: [
            {
                backgroundColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)'],
                data: [501, 764, 623, 501, 764],
                borderRadius: 10,
                barThickness: 100,
            },
        ],
    };
    public barChartPlugins = [ChartDataLabels];
    public barChartType: ChartType = 'bar';

    constructor(
        private partnerService: PartnerService,
        private toastr: ToastrService,
        private projectService: ProjectService
    ) {}

    totalFirstTimeGranteeCount = 0;
    totalGrantsApproved = 0;
    summaryTotalGrantsPerCountry: SummaryTotalGrantsPerCountry = {
        grantsPerCountry: [],
        overallTotal: 0,
    };

    loading = {
        approvedGrantsPerCountry: true,
        appliedGrantsPerCountry: true,
        grantsPerType: true,
    };
    summaryTotalApprovedGrantsPerCountry: SummaryChart[] = [];
    summaryTotalAppliedGrantsPerCountry: SummaryChart[] = [];
    summaryTotalGrantsPerType: SummaryChart[] = [];

    ngOnInit() {
        this.fetchPartners();
        this.fetchGrantsPerCountry();
        this.fetchGrantsPerType();
    }

    fetchPartners() {
        this.partnerService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data: PartnerList[] = res?.data ?? [];
                if (status) {
                    this.totalFirstTimeGranteeCount = data?.filter((item) => item?.applications?.length === 1)?.length;
                } else {
                    this.toastr.error('An error occurred while fetching Partners. Please try again', 'ERROR!');
                }
            },
            error: (err) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Partners. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchGrantsPerCountry() {
        this.projectService.fetchGroupProjectCountry().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as GrantPerCountry[];
                if (status) {
                    this.summaryTotalGrantsPerCountry.grantsPerCountry = data ?? [];
                    this.summaryTotalGrantsPerCountry.overallTotal = data?.reduce((total, acc) => {
                        return (total += isNaN(Number(acc?.total)) ? 0 : Number(acc?.total));
                    }, 0);
                    this.fetchApprovedGrantsPerCountry();
                    this.fetchAppliedGrantsPerCountry();
                } else {
                    this.toastr.error(
                        `An error occurred while fetching Projects Per Country. Please try again.`,
                        'ERROR!'
                    );
                }
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects Per Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchApprovedGrantsPerCountry() {
        this.loading.approvedGrantsPerCountry = true;
        this.projectService
            .fetchGroupProjectCountry({
                closing_status: GRANT_CLOSING_STATUS.completed,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = (res?.data ?? []) as GrantPerCountry[];
                    if (status) {
                        const overallTotal = this.summaryTotalGrantsPerCountry.overallTotal;
                        this.summaryTotalGrantsPerCountry?.grantsPerCountry?.forEach((item) => {
                            const countryData = data?.find((country) => country.country_name === item.country_name);
                            if (countryData) {
                                const totalApproval = isNaN(Number(countryData?.total))
                                    ? 0
                                    : Number(countryData?.total);
                                const value = this.getPercentageValue(totalApproval, overallTotal);
                                this.summaryTotalApprovedGrantsPerCountry.push({
                                    label: item.country_name,
                                    data: value,
                                });
                            }
                        });
                        const chartLabels = this.summaryTotalApprovedGrantsPerCountry?.map((item) => item.label);
                        const chartData = this.summaryTotalApprovedGrantsPerCountry?.map((item) => item.data);
                        this.grantsApprovedPerCountryChartData.labels = chartLabels;
                        this.grantsApprovedPerCountryChartData.datasets = [
                            {
                                data: chartData,
                            },
                        ];
                        this.grantsApprovedPerCountryChart?.update();
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Approved Projects Per Country. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading.approvedGrantsPerCountry = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Approved Projects Per Country. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading.approvedGrantsPerCountry = false;
                },
            });
    }

    fetchAppliedGrantsPerCountry() {
        this.loading.appliedGrantsPerCountry = true;
        this.projectService
            .fetchGroupProjectCountry({
                is_applied: true,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = (res?.data ?? []) as GrantPerCountry[];
                    if (status) {
                        const overallTotal = this.summaryTotalGrantsPerCountry.overallTotal;
                        this.summaryTotalGrantsPerCountry?.grantsPerCountry?.forEach((item) => {
                            const countryData = data?.find((country) => country.country_name === item.country_name);
                            if (countryData) {
                                const totalApplied = isNaN(Number(countryData?.total)) ? 0 : Number(countryData?.total);
                                const value = this.getPercentageValue(totalApplied, overallTotal);
                                this.summaryTotalAppliedGrantsPerCountry.push({
                                    label: item.country_name,
                                    data: value,
                                });
                            }
                        });
                        const chartLabels = this.summaryTotalAppliedGrantsPerCountry?.map((item) => item.label);
                        const chartData = this.summaryTotalAppliedGrantsPerCountry?.map((item) => item.data);
                        this.grantsAppliedPerCountryChartData.labels = chartLabels;
                        this.grantsAppliedPerCountryChartData.datasets = [
                            {
                                data: chartData,
                            },
                        ];
                        this.grantsAppliedPerCountryChart?.update();
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Applied Projects Per Country. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading.appliedGrantsPerCountry = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Applied Projects Per Country. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading.appliedGrantsPerCountry = false;
                },
            });
    }

    fetchGrantsPerType() {
        this.loading.grantsPerType = true;
        this.projectService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data as Project[];
                if (status) {
                    const approvedGrants = data?.filter(
                        (proj) => proj.closing_status === GRANT_CLOSING_STATUS.completed
                    );
                    this.totalGrantsApproved = approvedGrants?.reduce((total, acc) => {
                        return (total += isNaN(Number(acc?.project_proposal?.budget_request_usd))
                            ? 0
                            : Number(acc?.project_proposal?.budget_request_usd));
                    }, 0);
                    const combinedProjects = data?.filter((proj) => proj.status !== null) ?? [];
                    const totalProjects = combinedProjects?.length;
                    const { microGrantsCount, smallGrantsCount, mediumGrantsCount } =
                        this.getGrantTypesCount(combinedProjects);
                    const microGrantValue = this.getPercentageValue(microGrantsCount, totalProjects);
                    const smallGrantValue = this.getPercentageValue(smallGrantsCount, totalProjects);
                    const mediumGrantValue = this.getPercentageValue(mediumGrantsCount, totalProjects);
                    const combinedGrantValue = [
                        {
                            label: 'Micro Grants',
                            data: microGrantValue,
                        },
                        {
                            label: 'Small Grants',
                            data: smallGrantValue,
                        },
                        {
                            label: 'Medium Grants',
                            data: mediumGrantValue,
                        },
                    ];
                    combinedGrantValue.forEach(({ label, data }) => {
                        if (data !== 0) {
                            this.summaryTotalGrantsPerType.push({
                                label,
                                data,
                            });
                        }
                    });

                    this.grantsPerTypeChartData.labels = this.summaryTotalGrantsPerType.map((item) => item.label);
                    this.grantsPerTypeChartData.datasets = [
                        {
                            data: this.summaryTotalGrantsPerType.map((item) => item.data),
                        },
                    ];
                    this.grantsPerTypeChart?.update();
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                }
                this.loading.grantsPerType = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading.grantsPerType = false;
            },
        });
    }

    getGrantTypesCount(projects: Project[]) {
        const microGrantsCount = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof parsedBudgetRequestUsd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd < 10000;
            }
            return false;
        })?.length;

        const smallGrantsCount = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof proj?.project_proposal?.budget_request_usd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd >= 10000 && parsedBudgetRequestUsd <= 30000;
            }
            return false;
        })?.length;

        const mediumGrantsCount = projects?.filter((proj) => {
            const parsedBudgetRequestUsd = Number(proj?.project_proposal?.budget_request_usd);
            if (typeof parsedBudgetRequestUsd === 'number' && !isNaN(parsedBudgetRequestUsd)) {
                return parsedBudgetRequestUsd > 30000;
            }
            return false;
        })?.length;

        return {
            microGrantsCount,
            smallGrantsCount,
            mediumGrantsCount,
        };
    }

    getPercentageValue(value: number, total: number) {
        const percentage = value / total;
        return Number((percentage * 100).toFixed(2));
    }
}
