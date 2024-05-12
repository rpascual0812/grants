import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

type GrantPerCountry = {
    country_name: string;
    country_pk: string;
    total: string;
};

interface TotalGrantsPerCountry {
    labels: GrantPerCountry['country_name'][];
    data: number[];
    highestData: number;
}

const toKebabCase = (text: string) => {
    return text
        .trim()
        .replace(/\s+|[^\w-]/g, '-')
        .toLowerCase();
};

const getCountryFlagPng = (country: string) => {
    // Country flag references
    // https://emojipedia.org/joypixels/8.0/
    const FLAG_ASSET_BASE_PATH = `../../../assets/images/flags`;
    const countryName = toKebabCase(country);
    const png = `${FLAG_ASSET_BASE_PATH}/flag-${countryName}.png`;
    const image = new Image();
    image.src = png;
    return image;
};

@Component({
    selector: 'app-total-grants-per-country',
    templateUrl: './total-grants-per-country.component.html',
    styleUrls: ['./total-grants-per-country.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TotalGrantsPerCountryComponent implements OnInit {
    loading = true;
    totalGrantsPerCountry: TotalGrantsPerCountry | null = null;
    // Bar Chart
    public barChartType = 'bar' as const;

    @ViewChild(BaseChartDirective) horizontalBarChart: BaseChartDirective<'bar'> | undefined;
    public horizontalBarChartOptions: ChartConfiguration['options'] = {
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
    public horizontalBarChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            {
                data: [],
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
                yAxis.ticks.forEach((value, index: number) => {
                    const y = yAxis.getPixelForTick(index);
                    const countryFlag = getCountryFlagPng((value?.label as string) ?? '');
                    ctx.drawImage(countryFlag, yAxis.right + 30, y - 25, 50, 50);
                });
            },
        },
    ];

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    transformTotalGrantsPerCountry(groupedProjectCountry: GrantPerCountry[]): TotalGrantsPerCountry {
        const labels: string[] = [];
        const data: number[] = [];
        let highestData = 0;
        groupedProjectCountry.forEach((project) => {
            const total = Number(project?.total ?? 0);
            const label = project?.country_name ?? '';
            highestData = Math.max(highestData, total);
            labels.push(label);
            data.push(total);
        });
        return {
            labels,
            data,
            highestData,
        };
    }

    fetch() {
        this.projectService.fetchGroupProjectCountry().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.totalGrantsPerCountry = this.transformTotalGrantsPerCountry(data);
                    this.horizontalBarChartData.labels = this.totalGrantsPerCountry.labels;
                    this.setChartOptions();
                    this.horizontalBarChartData.datasets = [
                        {
                            data: this.totalGrantsPerCountry.data,
                            borderRadius: 100,
                            barThickness: 70,
                            borderSkipped: false,
                        },
                    ];
                    this.horizontalBarChart?.update();
                } else {
                    this.toastr.error(
                        `An error occurred while fetching Total Grants per Country. Please try again.`,
                        'ERROR!'
                    );
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Total Grants per Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    setChartOptions() {
        if (this.horizontalBarChartOptions) {
            this.horizontalBarChartOptions.scales = {
                x: {
                    max: this.totalGrantsPerCountry?.highestData ?? 10,
                    ticks: {
                        font: {
                            size: 16,
                        },
                    },
                },
                y: {
                    display: false,
                    beginAtZero: true,
                },
            };
        }
    }
}
