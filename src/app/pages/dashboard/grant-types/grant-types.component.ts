import { Component, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-grant-types',
    templateUrl: './grant-types.component.html',
    styleUrls: ['./grant-types.component.scss'],
})
export class GrantTypesComponent {
    // Bar Chart
    public barChartType = 'bar' as const;
    countryFlags = [
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
                    const currentGrants = [`2,400 USD`, `13,600 USD`, `29,000 USD`];
                    const cumulativeGrants = [`13,600 USD`, `13,600 USD`, `29,000 USD`];
                    const datasetLabel = ctx?.dataset?.label;
                    const idx = ctx?.dataIndex;
                    if (datasetLabel === 'Cumulative Grants') {
                        return cumulativeGrants[idx] ?? '';
                    } else {
                        return currentGrants[idx] ?? '';
                    }
                },
                labels: {
                    value: {
                        anchor: 'center',
                        align: 'center',
                        formatter: (_value, ctx) => {
                            const description = [`$500 - $9,999`, `$10,000 - $30,000`, `$30,000 above`];
                            const datasetLabel = ctx?.dataset?.label;
                            const idx = ctx?.dataIndex;
                            if (datasetLabel === 'Cumulative Grants') return '';
                            else {
                                return description[idx] ?? '';
                            }
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
                max: 4000,
                ticks: {
                    font: {
                        size: 14,
                    },
                    callback: (tickValue, _index, _ticks) => {
                        return `${tickValue} USD`;
                    },
                },
                stacked: true,
            },
            y: {
                beginAtZero: true,
                stacked: true,
            },
        },
    };

    public horizontalBarChartData: ChartData<'bar'> = {
        labels: ['Micro grant', 'Small grant', 'Medium grant'],
        datasets: [
            {
                label: `Current Grants`,
                backgroundColor: [`rgb(26 115 232)`, `rgb(76 175 80) `, `rgb(26 35 126)`],
                data: [2000, 2500, 2500],
                barThickness: 70,
                borderSkipped: false,
            },
            {
                label: `Cumulative Grants`,
                data: [1000, 1000, 1200],
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
}
