import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-report-ggf',
    templateUrl: './report-ggf.component.html',
    styleUrls: ['./report-ggf.component.scss'],
})
export class ReportGgfComponent {
    // Pie Chart Number Of Grants
    @ViewChild(BaseChartDirective) pieChartNumberOfGrants: BaseChartDirective | undefined;
    numberOfGrant = [
        {
            label: 'Climate related',
            data: 10,
            color: '#0070C0',
        },
        {
            label: 'Indigenous People',
            data: 20,
            color: '#A65628',
        },
        {
            label: 'Support and Recovery from Pandemic',
            data: 30,
            color: '#5B9BD5',
        },
        {
            label: 'Unrestricted',
            data: 40,
            color: '#00B050',
        },
        {
            label: 'Disability',
            data: 50,
            color: '#0070C0',
        },
    ];
    numberOfGrantOptionsLabel = this.numberOfGrant?.map((item) => item.label);
    numberOfGrantOptionsData = this.numberOfGrant?.map((item) => item.data);
    numberOfGrantOptionsColor = this.numberOfGrant?.map((item) => item.color);

    public pieChartNumberOfGrantOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            autoPadding: true,
        },
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
    };
    public pieChartNumberOfGrantsData: ChartData<'pie', number[], string | string[]> = {
        datasets: [
            {
                backgroundColor: this.numberOfGrantOptionsColor,
                data: this.numberOfGrantOptionsData,
            },
        ],
    };
    public pieChartNumberOfGrantsPlugins = [ChartDataLabels];
    public pieChartNumberOfGrantsType: ChartType = 'pie';

    @ViewChild(BaseChartDirective) pieChartTotalFunds: BaseChartDirective | undefined;
    totalOfFunds = [
        {
            label: 'Climate related',
            data: 10,
            color: '#FFC000',
        },
        {
            label: 'Indigenous People',
            data: 20,
            color: '#A65628',
        },
        {
            label: 'Support and Recovery from Pandemic',
            data: 30,
            color: '#ED7D31',
        },
        {
            label: 'Unrestricted',
            data: 40,
            color: '#FF9900',
        },
        {
            label: 'Disability',
            data: 50,
            color: '#FFFF00',
        },
    ];
    totalOfFundsOptionsLabel = this.totalOfFunds?.map((item) => item.label);
    totalOfFundsOptionsData = this.totalOfFunds?.map((item) => item.data);
    totalOfFundsOptionsColor = this.totalOfFunds?.map((item) => item.color);

    public pieChartTotalFundsOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            autoPadding: true,
        },
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
    };
    public pieChartTotalFundsData: ChartData<'pie', number[], string | string[]> = {
        labels: this.totalOfFundsOptionsLabel,
        datasets: [
            {
                backgroundColor: this.totalOfFundsOptionsColor,
                data: this.totalOfFundsOptionsData,
            },
        ],
    };
    public pieChartTotalFundsPlugins = [ChartDataLabels];
    public pieChartTotalFundsType: ChartType = 'pie';
}
