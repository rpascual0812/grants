import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-report-fgg',
    templateUrl: './report-fgg.component.html',
    styleUrls: ['./report-fgg.component.scss'],
})
export class ReportFggComponent {
    // Pie Chart Number Of Grants
    @ViewChild(BaseChartDirective) pieChartNumberOfGrants: BaseChartDirective | undefined;
    numberOfGrant = [
        {
            label: 'Tenure Arrangements',
            data: 10,
            color: '#0070C0',
        },
        {
            label: 'Civil Space',
            data: 10,
            color: '#A65628',
        },
        {
            label: 'Rules for Business and Corporate Conduct',
            data: 10,
            color: '#5B9BD5',
        },
        {
            label: 'Policy Space/Support',
            data: 10,
            color: '#00B050',
        },
        {
            label: 'Energy',
            data: 10,
            color: '#0070C0',
        },
        {
            label: 'Climate',
            data: 10,
            color: '#0070C0',
        },
        {
            label: 'Environmental Policies',
            data: 10,
            color: '#0070C0',
        },
        {
            label: 'Government Policies',
            data: 30,
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
            label: 'Tenure Arrangements',
            data: 10,
            color: '#FFC000',
        },
        {
            label: 'Civil Space',
            data: 10,
            color: '#A65628',
        },
        {
            label: 'Rules for Business and Corporate Conduct',
            data: 10,
            color: '#ED7D31',
        },
        {
            label: 'Policy Space/Support',
            data: 10,
            color: '#FF9900',
        },
        {
            label: 'Energy',
            data: 10,
            color: '#FFFF00',
        },
        {
            label: 'Climate',
            data: 10,
            color: '#FFC000',
        },
        {
            label: 'Environmental Policies',
            data: 10,
            color: '#A65628',
        },
        {
            label: 'Government Policies',
            data: 30,
            color: '#ED7D31',
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
