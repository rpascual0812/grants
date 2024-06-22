import { Component } from '@angular/core';

@Component({
    selector: 'app-thematic-areas',
    templateUrl: './thematic-areas.component.html',
    styleUrls: ['./thematic-areas.component.scss']
})
export class ThematicAreasComponent {
    areas: any = [
        {
            title: 'Tenure',
            descriptions: [
                '(sub threes) IP territories/ domains;',
                'agrarian rights',
                'marine tenure rights',
                'tenure conflict resolution'
            ],
            color: '#83380c'
        },
        {
            title: 'Governance and Leadership Development',
            descriptions: [
                '(sub themes) Indigenous governance, including the roles of women, youth and differently abled people;',
                'Instutional strengthening of community or local institutions',
                'CSO/ NGO organizationl development',
                'IPLC rights awareness and leadership capacity development',
                'CSO/NGO/ IPLC dfending and expanding civic space'
            ],
            color: '#d27b26'
        },
        {
            title: 'Natural Resource Governance',
            descriptions: [
                '(sub themes) IPLC rights to access and control',
                'Community-led natural resource management and development',
                'Natural resource conflict resolution;',
                'Environmental protection, conservation and restoration'
            ],
            color: '#9c4715'
        },
        {
            title: 'Next Generation',
            descriptions: [
                '(sub themes) YOUTH leadership and capacity development',
                'Education support',
                'Inter-generational learning'
            ],
            color: '#b78121'
        },
        {
            title: 'Living Economy',
            descriptions: [
                '(sub themes) Food security and sovereignty',
                'Sustainable/ rural livelihoods',
                'Social enterprise and income generation'
            ],
            color: '#c55d1e'
        },
        {
            title: 'Disability rights in the intersection of Environmental Justice',
            descriptions: [
                '(sub themes) Diffables capacity development',
                'Support to diffables for livelihoods and increased participation'
            ],
            color: '#d29427'
        },
        {
            title: 'Mitigating & Adapting to Climate Change',
            descriptions: [
                '(sub themes) Safeguarding tenure rights to landscapes earmarked for low emissions development',
                'Loss and damage Ecosystems-based adaptation (EbA)',
                'Policy development, lobby and advocacy',
                'Climate financing'
            ],
            color: '#d46623'
        },
    ];
}
