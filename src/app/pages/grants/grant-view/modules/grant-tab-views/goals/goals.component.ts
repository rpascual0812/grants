import { Component } from '@angular/core';

const STATIC_GGF_FOCUS = [
    {
        id: 1,
        title: `TENURE`,
        description: `(sub thees) IP territories/domains, agragarian rights marine tenure rights conflict resolution`,
    },
    {
        id: 2,
        title: `NATURAL RESOURCE GOVERNANCE`,
        description: `(sub themes) IPLC rights to access and control Community-led natural resource management and development Natural resource conflict resolution; Environment protection, conservation and restoration`,
    },
    {
        id: 3,
        title: `LIVING ECONOMY`,
        description: `(sub themes) Food security and sovereignty Sustainable/ rural livelihoods Social enterprise and income generation`,
    },
    {
        id: 4,
        title: `MITIGATING & ADAPTING TO CLIMATE CHANGE`,
        description: `(sub themes) Safeguarding tenure rights to landscape earmarked for low emissions development Loss and damage Ecosystems-based adaptation (Eba) Policy development, lobby not advocacy Climate financing`,
    },
    {
        id: 5,
        title: `GOVERNANCE AND LEADERSHIP DEVELOPMENT`,
        description: `(sub themes) Indigenous governance, including the roles of women, youth and differently abled people. Institutional strengthening of community or local institutions CSO/NGO organizational development IPLC rights awareness and leadership capacity development CSO/NGO/IPLC defending and expanding civic space`,
    },
    {
        id: 6,
        title: `NEXT GENERATION`,
        description: `(sub themes) YOUTH leadership and capacity development Education support inter-generation learning`,
    },
    {
        id: 7,
        title: `DISABILITY RIGHTS in the intersection of ENVIRONMENTAL JUSTICE`,
        description: `(sub themes) Diffables capacity development Support to diffables for livelihoods and increased participation`,
    },
    {
        id: 8,
        title: `DISABILITY RIGHTS and TACKLING INFORMATION`,
        description: ``,
    },
];

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent {
    ggfFocus = STATIC_GGF_FOCUS;
}
