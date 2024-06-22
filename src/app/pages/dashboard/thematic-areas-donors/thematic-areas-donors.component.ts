import { Component } from '@angular/core';

@Component({
    selector: 'app-thematic-areas-donors',
    templateUrl: './thematic-areas-donors.component.html',
    styleUrls: ['./thematic-areas-donors.component.scss']
})
export class ThematicAreasDonorsComponent {
    areas: any = [
        {
            title: 'Climate Related',
            description: 'In support of cultural security and sustainable development for indigenous People and Local Communities (IPLCs) across Southeast Asia, Samdhana supports resource conflict resolution and mediation, especially on land tenure and resource governance. Through a combination of understanding analysis, policy and management, we advocate for community-based property rights, giving priority to threatened communities and ecosystems.',
            color: '#3198cf'
        },
        {
            title: 'Indigenous People',
            description: 'In support of cultural security and sustainable development for indigenous People and Local Communities (IPLCs) across Southeast Asia, Samdhana supports resource conflict resolution and mediation, especially on land tenure and resource governance. Through a combination of understanding analysis, policy and management, we advocate for community-based property rights, giving priority to threatened communities and ecosystems.',
            color: '#54c1f7'
        },
        {
            title: 'Support and Recovery from Pandemic',
            description: 'In support of cultural security and sustainable development for indigenous People and Local Communities (IPLCs) across Southeast Asia, Samdhana supports resource conflict resolution and mediation, especially on land tenure and resource governance. Through a combination of understanding analysis, policy and management, we advocate for community-based property rights, giving priority to threatened communities and ecosystems.',
            color: '#90dbfe'
        },
        {
            title: 'Unrestricted',
            description: 'In support of cultural security and sustainable development for indigenous People and Local Communities (IPLCs) across Southeast Asia, Samdhana supports resource conflict resolution and mediation, especially on land tenure and resource governance. Through a combination of understanding analysis, policy and management, we advocate for community-based property rights, giving priority to threatened communities and ecosystems.',
            color: '#3198cf'
        },
        {
            title: 'Disability Rights',
            description: 'In support of cultural security and sustainable development for indigenous People and Local Communities (IPLCs) across Southeast Asia, Samdhana supports resource conflict resolution and mediation, especially on land tenure and resource governance. Through a combination of understanding analysis, policy and management, we advocate for community-based property rights, giving priority to threatened communities and ecosystems.',
            color: '#54c1f7'
        },
    ];
}
