import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PartnerService } from 'src/app/services/partner.service';
import { ToastrService } from 'ngx-toastr';
import { Application, Partner } from 'src/app/interfaces/_application.interface';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { Project } from 'src/app/interfaces/_project.interface';
import { GRANT_CLOSING_STATUS } from 'src/app/utilities/constants';
import { SummaryService } from './summary.service';
import { GrantPerCountry } from 'src/app/components/common-grants-per-country-chart/common-grants-per-country-chart.component';
interface PartnerList extends Partner {
    applications?: Application[];
}

interface SummaryChart {
    label: string;
    data: number;
}

export interface TotalGrantsPerCountry {
    labels: GrantPerCountry['country_name'][];
    codes: GrantPerCountry['country_code'][];
    data: number[];
}

const getCountryFlagPng = (country: string) => {
    const png = `https://flagsapi.com/${country}/flat/64.png`;
    const image = new Image();
    image.src = png;
    return image;
};

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    // Static Pie Chart
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

    // Grants Per Country Pie Chart
    totalGrantsPerCountry: TotalGrantsPerCountry | null = null;
    @ViewChild(BaseChartDirective) grantsPerCountryChart: BaseChartDirective<'bar'> | undefined;
    public grantsPerCountryChartOptions: ChartConfiguration['options'] = {
        // We use these empty structures as placeholders for dynamic theming.
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        indexAxis: 'y',
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
                    size: 16,
                },
            },
        },
        scales: {},
    };
    public grantsPerCountryChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    };
    public grantsPerCountryChartPlugins = [
        ChartDataLabels,
        {
            id: 'barPlugins',
            afterDraw: (chart: Chart<'bar'>) => {
                const ctx = chart.ctx;
                const yAxis = chart.scales['y'];
                yAxis.ticks.forEach((value, index: number) => {
                    const name: any = value?.label;
                    const pos: number = this.totalGrantsPerCountry?.labels.indexOf(name) ?? 0;

                    const y = yAxis.getPixelForTick(index);
                    const countryFlag = getCountryFlagPng((this.totalGrantsPerCountry?.codes[pos] as string) ?? '');
                    ctx.drawImage(countryFlag, yAxis.right + 30, y - 25, 50, 50);
                });
            },
        },
    ];
    public grantsPerCountryChartType: ChartType = 'bar';

    // Static Bar Chart
    @ViewChild(BaseChartDirective) barChart: BaseChartDirective<'bar'> | undefined;
    public barChartChartOptions: ChartConfiguration['options'] = {
        // We use these empty structures as placeholders for dynamic theming.
        responsive: true,
        maintainAspectRatio: true,
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
        private summaryService: SummaryService
    ) {}

    totalFirstTimeGranteeCount = 0;
    totalGrantsApproved = 0;

    loading = {
        section: true,
        grantsPerCountry: true,
        approvedGrantsPerCountry: true,
        appliedGrantsPerCountry: true,
        grantsPerType: true,
    };

    summaryTotalGrantsPerCountry: SummaryChart[] = [];
    summaryTotalApprovedGrantsPerCountry: SummaryChart[] = [];
    summaryTotalAppliedGrantsPerCountry: SummaryChart[] = [];
    summaryTotalGrantsPerType: SummaryChart[] = [];

    ngOnInit() {
        this.summaryService.currentProjectList.subscribe((value) => {
            this.loading.section = value?.loading ?? false;
            if (value?.loading) {
                this.processGrantsApproved([]);
                this.processFirstTimeGrantee([]);
                this.processGrantsPerType([]);
                this.processGrantsPerCountry([]);
            } else {
                this.processGrantsApproved(value?.projects ?? []);
                this.processFirstTimeGrantee(value?.projects ?? []);
                this.processGrantsPerType(value?.projects ?? []);
                this.processGrantsPerCountry(value?.projects ?? []);
                if (this.barChart?.data) {
                    this.barChart.data.labels = [
                        'Climate related',
                        'Indigenous',
                        'Support and Recovery from Pandemic',
                        'Unrestricted',
                        'Disability Rights',
                    ];
                    this.barChart.data.datasets = [
                        {
                            backgroundColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)'],
                            data: [501, 764, 623, 501, 764],
                            borderRadius: 10,
                            barThickness: 100,
                        },
                    ];
                    this.barChart?.update();
                }
            }
        });
    }

    fetchPartners() {}

    processGrantsApproved(projects: Project[]) {
        const approvedGrants = projects?.filter((proj) => proj.closing_status === GRANT_CLOSING_STATUS.completed);
        this.totalGrantsApproved = approvedGrants?.reduce((total, acc) => {
            return (total += isNaN(Number(acc?.project_proposal?.budget_request_usd))
                ? 0
                : Number(acc?.project_proposal?.budget_request_usd));
        }, 0);
    }

    processFirstTimeGrantee(projects: Project[]) {
        this.partnerService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data: PartnerList[] = res?.data ?? [];
                if (status) {
                    const firstTimeGrantee = data
                        ?.filter((partner) => partner?.applications?.length === 1)
                        ?.map((partner) => partner.pk);
                    let partnerPks: number[] = [];
                    let countFirstTimeGrantee = 0;
                    projects?.forEach((proj) => {
                        const partnerPk = proj?.partner?.pk as number;
                        const existingPartnerPk = partnerPks?.includes(partnerPk);
                        if (!existingPartnerPk) {
                            partnerPks.push(partnerPk);
                        }
                    });
                    partnerPks.forEach((partnerPk) => {
                        if (firstTimeGrantee.includes(partnerPk)) {
                            countFirstTimeGrantee += 1;
                        }
                    });
                    this.totalFirstTimeGranteeCount = countFirstTimeGrantee;
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

    processGrantsPerCountry(projects: Project[]) {
        this.loading.grantsPerCountry = true;
        this.loading.approvedGrantsPerCountry = true;
        this.loading.appliedGrantsPerCountry = true;

        const countGrantsPerCountry = this.getCountGrantsPerCountry(projects);
        this.setGrantsPerCountryChart(countGrantsPerCountry);
        this.loading.grantsPerCountry = false;

        const countApprovedGrantsPerCountry = this.getCountApprovedGrantsPerCountry(projects);
        this.setApprovedGrantsPerCountryChart(countApprovedGrantsPerCountry, countGrantsPerCountry);
        this.loading.approvedGrantsPerCountry = false;

        const countAppliedGrantsPerCountry = this.getCountAppliedGrantsPerCountry(projects);
        this.setAppliedGrantsPerCountryChart(countAppliedGrantsPerCountry, countGrantsPerCountry);
        this.loading.appliedGrantsPerCountry = false;
    }

    getCountGrantsPerCountry(projects: Project[]) {
        const countGrantsPerCountry: Record<string, any> = {};
        projects?.forEach((proj) => {
            const projectLoc = proj?.project_location ?? [];
            projectLoc?.forEach((loc) => {
                const countryPk = loc?.country_pk;
                if (countryPk) {
                    if (!countGrantsPerCountry[countryPk]) {
                        countGrantsPerCountry[countryPk] = {
                            pk: countryPk,
                            code: loc?.country?.code,
                            name: loc?.country?.name,
                            count: 1,
                        };
                    } else {
                        countGrantsPerCountry[countryPk].count += 1;
                    }
                }
            });
        });
        return countGrantsPerCountry;
    }

    setGrantsPerCountryChart(countGrantsPerCountry: Record<string, any>) {
        this.totalGrantsPerCountry = this.transformTotalGrantsPerCountry(countGrantsPerCountry);
        this.summaryTotalGrantsPerCountry = Object.entries(countGrantsPerCountry).map(([key, item]) => {
            const value = item.count;
            return {
                label: item.name,
                data: value,
            };
        });
        this.grantsPerCountryChartData.labels = this.totalGrantsPerCountry.labels;
        this.grantsPerCountryChartData.datasets = [
            {
                data: this.totalGrantsPerCountry.data,
                borderRadius: 100,
                barThickness: 70,
                borderSkipped: false,
            },
        ];
        this.grantsPerCountryChart?.update();
    }

    getCountApprovedGrantsPerCountry(projects: Project[]) {
        const countGrantsPerCountry: Record<string, any> = {};
        projects?.forEach((proj) => {
            const status = proj?.closing_status;
            const projectLoc = proj?.project_location ?? [];
            if (status === GRANT_CLOSING_STATUS.completed) {
                projectLoc?.forEach((loc) => {
                    const countryPk = loc?.country_pk;
                    if (countryPk) {
                        if (!countGrantsPerCountry[countryPk]) {
                            countGrantsPerCountry[countryPk] = {
                                pk: countryPk,
                                code: loc?.country?.code,
                                name: loc?.country?.name,
                                count: 1,
                            };
                        } else {
                            countGrantsPerCountry[countryPk].count += 1;
                        }
                    }
                });
            }
        });
        return countGrantsPerCountry;
    }

    setApprovedGrantsPerCountryChart(
        countApprovedGrantsPerCountry: Record<string, any>,
        countGrantsPerCountry: Record<string, any>
    ) {
        this.summaryTotalApprovedGrantsPerCountry = Object.entries(countApprovedGrantsPerCountry).map(([key, item]) => {
            const overallGrantCountry = countGrantsPerCountry[key]?.count ?? 0;
            const value = this.getPercentageValue(item?.count ?? 0, overallGrantCountry);
            return {
                label: item.name,
                data: value,
            };
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
    }

    getCountAppliedGrantsPerCountry(projects: Project[]) {
        const countGrantsPerCountry: Record<string, any> = {};
        projects?.forEach((proj) => {
            const status = proj?.status;
            const projectLoc = proj?.project_location ?? [];
            if (status) {
                projectLoc?.forEach((loc) => {
                    const countryPk = loc?.country_pk;
                    if (countryPk) {
                        if (!countGrantsPerCountry[countryPk]) {
                            countGrantsPerCountry[countryPk] = {
                                pk: countryPk,
                                code: loc?.country?.code,
                                name: loc?.country?.name,
                                count: 1,
                            };
                        } else {
                            countGrantsPerCountry[countryPk].count += 1;
                        }
                    }
                });
            }
        });
        return countGrantsPerCountry;
    }

    setAppliedGrantsPerCountryChart(
        countAppliedGrantsPerCountry: Record<string, any>,
        countGrantsPerCountry: Record<string, any>
    ) {
        this.summaryTotalAppliedGrantsPerCountry = Object.entries(countGrantsPerCountry).map(([key, item]) => {
            const overallGrantCountry = countAppliedGrantsPerCountry[key]?.count ?? 0;
            const value = this.getPercentageValue(item?.count ?? 0, overallGrantCountry);
            return {
                label: item.name,
                data: value,
            };
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
    }

    processGrantsPerType(projects: Project[]) {
        this.loading.grantsPerType = true;
        this.summaryTotalGrantsPerType = [];
        const approvedGrants = projects?.filter((proj) => proj.closing_status === GRANT_CLOSING_STATUS.completed);
        this.totalGrantsApproved = approvedGrants?.reduce((total, acc) => {
            return (total += isNaN(Number(acc?.project_proposal?.budget_request_usd))
                ? 0
                : Number(acc?.project_proposal?.budget_request_usd));
        }, 0);
        const combinedProjects = projects?.filter((proj) => proj.status !== null) ?? [];
        const totalProjects = combinedProjects?.length;
        const { microGrantsCount, smallGrantsCount, mediumGrantsCount } = this.getGrantTypesCount(combinedProjects);
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
        this.loading.grantsPerType = false;
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
        const computed = percentage * 100;
        return isNaN(Number(computed)) ? 0 : Number((percentage * 100).toFixed(2));
    }

    transformTotalGrantsPerCountry(groupedProjectCountry: Record<string, any>) {
        const labels: string[] = [];
        const codes: string[] = [];
        const data: number[] = [];
        Object.entries(groupedProjectCountry).forEach(([key, item]) => {
            labels.push(item.name);
            codes.push(item.code);
            data.push(item.count);
        });
        return {
            labels,
            codes,
            data,
        };
    }
}
