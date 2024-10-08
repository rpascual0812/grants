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
            description: 'Support for travels of members of CSOs and IPLCs to attend meetings, conferences, and other capacity development, research, or knowledge sharing activities/ events.',
            color: '#034f75'
        },
        {
            type: 'Capacity Development / Institutional Development Support Grants',
            image: '../../../assets/images/capacity_development.png',
            description: 'to empower and equip strategically local CSOs and IPLCs to cater to the requirement of organization good governance.',
            color: '#34a5c1'
        },
        {
            type: 'Urgent Action',
            image: '../../../assets/images/urgent_action.png',
            description: 'to support activists, communities, CSOs who are in emergency situations that sometimes mean life and death for a community or an individual, i.e. for urgent evacuation, or for local responders in natural disasters, other support for legal action and others.',
            color: '#80c5e4'
        },
        {
            type: 'Education and Indigenous Knowledge Building Grants',
            image: '../../../assets/images/education_grant.png',
            description: 'assist the member of IPLCs in enrolling in various formal and/ or informal/or vocational training/education programmes to equip them with the necessary knowledge for better management capacity; good governance and/ or livelihoods improvement.',
            color: '#f9b001'
        },
        {
            type: 'Resiliency Building and Social Justice Grants and Support',
            image: '../../../assets/images/social_justice_grant.png',
            description: 'providing support for indigenous peoples, local communities, individual leaders and activists, CSOs and networks of social and environmental movements in SEA to improve their ability to respond to the ever changing conditions in the region.',
            color: '#049bd8'
        },
    ];
}
