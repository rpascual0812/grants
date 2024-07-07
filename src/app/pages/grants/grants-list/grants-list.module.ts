import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsListComponent } from './grants-list.component';
import { ContractFinalizationModule } from './modules/contract-finalization/contract-finalization.module';
import { FundReleaseModule } from './modules/fund-release/fund-release.module';
import { SummaryModule } from './modules/summary/summary.module';

@NgModule({
    declarations: [GrantsListComponent],
    exports: [GrantsListComponent],
    imports: [CommonModule, ContractFinalizationModule, FundReleaseModule, SummaryModule],
})
export class GrantsListModule {}
