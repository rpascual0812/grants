import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsListComponent } from './grants-list.component';
import { GrantApplicationModule } from './modules/grant-application/grant-application.module';
import { ContractFinalizationModule } from './modules/contract-finalization/contract-finalization.module';
import { FundReleaseModule } from './modules/fund-release/fund-release.module';

@NgModule({
  declarations: [
    GrantsListComponent
  ],
  exports: [
    GrantsListComponent
  ],
  imports: [
    CommonModule,
    GrantApplicationModule,
    ContractFinalizationModule,
    FundReleaseModule,
  ]
})
export class GrantsListModule { }
