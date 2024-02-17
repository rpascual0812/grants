import { ContractFinalizationModule } from './modules/contract-finalization/contract-finalization.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsListComponent } from './applications-list.component';
import { GrantApplicationModule } from './modules/grant-application/grant-application.module';
import { FundReleaseModule } from './modules/fund-release/fund-release.module';

@NgModule({
    declarations: [ApplicationsListComponent],
    exports: [ApplicationsListComponent],
    imports: [CommonModule, GrantApplicationModule, ContractFinalizationModule, FundReleaseModule],
})
export class ApplicationsListModule {}
