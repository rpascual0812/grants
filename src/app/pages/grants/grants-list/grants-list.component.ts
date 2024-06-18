import { Component, Input, ViewChild } from '@angular/core';
import { ContractFinalizationComponent } from './modules/contract-finalization/contract-finalization.component';
import { FundReleaseComponent } from './modules/fund-release/fund-release.component';

@Component({
    selector: 'app-grants-list',
    templateUrl: './grants-list.component.html',
    styleUrls: ['./grants-list.component.scss']
})
export class GrantsListComponent {
    @ViewChild(ContractFinalizationComponent) contractFinalizationComponent: ContractFinalizationComponent;
    @ViewChild(FundReleaseComponent) fundReleaseComponent: FundReleaseComponent;

    @Input() filter: string

    setDonors(donors: any) {
        if (this.filter == 'contractFinalization') {
            this.contractFinalizationComponent.setDonors(donors);
        }
        else {
            this.fundReleaseComponent.setDonors(donors);
        }
    }
}
