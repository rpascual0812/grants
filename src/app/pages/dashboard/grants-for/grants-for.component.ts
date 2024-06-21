import { Component, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-grants-for',
    templateUrl: './grants-for.component.html',
    styleUrls: ['./grants-for.component.scss']
})
export class GrantsForComponent {
    grants: any = [
        {
            type: 'Travel grant',
            image: '../../../assets/images/travel_grant.png',
            description: ''
        },
        {
            type: 'Capacity Development',
            image: '../../../assets/images/capacity_development.png',
            description: ''
        },
        {
            type: 'Urgent Action',
            image: '../../../assets/images/urgent_action.png',
            description: ''
        },
        {
            type: 'Education Grant',
            image: '../../../assets/images/education_grant.png',
            description: ''
        },
        {
            type: 'Indigenous Knowledge Building',
            image: '../../../assets/images/indigenous_knowledge_building.png',
            description: ''
        },
        {
            type: 'Resiliency Building',
            image: '../../../assets/images/resiliency_building.png',
            description: ''
        },
        {
            type: 'Social Justice Grant',
            image: '../../../assets/images/social_justice_grant.png',
            description: ''
        },
        {
            type: 'Institutional Development',
            image: '../../../assets/images/institutional_development.png',
            description: ''
        }
    ];
}
