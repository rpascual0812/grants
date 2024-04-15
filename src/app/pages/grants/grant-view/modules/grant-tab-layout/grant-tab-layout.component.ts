import { Component, ViewEncapsulation } from '@angular/core';
import { FundingReleaseComponent } from '../grant-tab-views/funding-release/funding-release.component';
import { GoalsComponent } from '../grant-tab-views/goals/goals.component';
import { BeneficiariesComponent } from '../grant-tab-views/beneficiaries/beneficiaries.component';
import { AttendeesComponent } from '../grant-tab-views/attendees/attendees.component';

interface Tab {
    title: string;
    content: any;
    active?: boolean;
    customClass?: string;
}

@Component({
    selector: 'app-grant-tab-layout',
    templateUrl: './grant-tab-layout.component.html',
    styleUrls: ['./grant-tab-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantTabLayoutComponent {

    tabs: Tab[] = [
        { title: 'Funding Release', content: FundingReleaseComponent, customClass: 'custom-tab-class', active: true },
        { title: 'Goals', content: GoalsComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Beneficiaries', content: BeneficiariesComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Attendees', content: AttendeesComponent, customClass: 'custom-tab-class', active: false },
    ];
}
