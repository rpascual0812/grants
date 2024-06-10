import { Component, Input, ViewChild } from '@angular/core';
import { ContractFinalizationComponent } from './modules/contract-finalization/contract-finalization.component';

@Component({
    selector: 'app-grants-list',
    templateUrl: './grants-list.component.html',
    styleUrls: ['./grants-list.component.scss']
})
export class GrantsListComponent {
    @ViewChild(ContractFinalizationComponent) contractFinalizationComponent: ContractFinalizationComponent;

    @Input() filter: string

    setDonors(donors: any) {
        this.contractFinalizationComponent.setDonors(donors);
    }
}
