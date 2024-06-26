import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DonorService } from 'src/app/services/donor.service';
import { GrantsListComponent } from './grants-list/grants-list.component';

@Component({
    selector: 'app-grants',
    templateUrl: './grants.component.html',
    styleUrls: ['./grants.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantsComponent implements OnInit {
    @ViewChild(GrantsListComponent) grantListComponent: GrantsListComponent;

    currentExpandedAccordion = new Set();
    filterSelections = [
        { label: 'Contract Finalization', id: 'contractFinalization', checked: false },
        { label: 'Fund Release', id: 'fundRelease', checked: false },
    ];
    selectedFilterIds = 'contractFinalization'
    donors: Record<string, string>[] = [];
    selectedActiveDonorIds: any = [];
    showFormerDonors: boolean = false;

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

    // Bar Chart
    // Country flag references
    // https://emojipedia.org/joypixels/8.0/
    public barChartType = 'bar' as const;
    countryFlags = [
        'https://em-content.zobj.net/source/joypixels/369/flag-philippines_1f1f5-1f1ed.png',
        'https://em-content.zobj.net/source/joypixels/369/flag-indonesia_1f1ee-1f1e9.png',
        'https://em-content.zobj.net/source/joypixels/369/flag-laos_1f1f1-1f1e6.png',
    ].map((png) => {
        const image = new Image();
        image.src = png;
        return image;
    });
    @ViewChild(BaseChartDirective) horizontalBarChart: BaseChartDirective<'bar'> | undefined;
    public horizontalBarChartOptions: ChartConfiguration['options'] = {
        // We use these empty structures as placeholders for dynamic theming.
        responsive: true,
        maintainAspectRatio: false,
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
                    size: 18,
                },
            },
        },
        scales: {
            x: {
                max: 1000,
                ticks: {
                    font: {
                        size: 18,
                    },
                },
            },
            y: {
                display: false,
                beginAtZero: true,
            },
        },
    };
    public horizontalBarChartData: ChartData<'bar'> = {
        labels: ['Philippines', 'Vietname', 'Laos'],
        datasets: [
            {
                backgroundColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)'],
                data: [501, 756, 603],
                borderRadius: 100,
                barThickness: 70,
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
                    const y = yAxis.getPixelForTick(index);
                    ctx.drawImage(this.countryFlags[index], yAxis.right + 30, y - 25, 50, 50);
                });
            },
        },
    ];

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

    constructor(
        private donorService: DonorService,
        private cdr: ChangeDetectorRef,
    ) {
        // mock active donors
        this.init();
    }

    ngOnInit() { }

    init() {
        this.fetchDonors();
        // for (let i = 1; i <= 6; i++) {
        //     this.donors.push({
        //         id: `${i}`,
        //         code: `${i}`,
        //         label: `Global Greengrants Fund/GGF ${i}`,
        //     });
        // }
    }

    fetchDonors() {
        const filters = {
            showInactive: this.showFormerDonors
        }
        this.donorService.fetch(filters).subscribe({
            next: (res: any) => {
                this.donors = res.data;
            },
            error: (err) => {
                // const { statusCode, errorMessage } = extractErrorMessage(err);
                // this.toastr.error(
                //     `An error occurred while fetching Total Grants per Country. ${statusCode} ${errorMessage} Please try again.`,
                //     'ERROR!'
                // );
                // this.loading = false;
            },
        });
    }

    handleCheckedFilterSelect(id: string) {
        this.selectedFilterIds = id
    }

    handleExpandAccordion($event: boolean, section: string) {
        if ($event) {
            this.currentExpandedAccordion.add(section);
        } else {
            this.currentExpandedAccordion.delete(section);
        }
    }

    handleSelectActiveDonor(pk: string) {
        if (this.selectedActiveDonorIds.includes(pk)) {
            const index = this.selectedActiveDonorIds.indexOf(pk);
            this.selectedActiveDonorIds.splice(index, 1);
        }
        else {
            this.selectedActiveDonorIds.push(pk);
        }

        this.grantListComponent.setDonors(this.selectedActiveDonorIds);

        this.cdr.detectChanges();
    }

    handleToggleShowInactiveDonors($event: any, showInactiveDonors: boolean) {
        this.showFormerDonors = $event.target.checked;
        this.fetchDonors();
        $event.stopPropagation();
    }
}
