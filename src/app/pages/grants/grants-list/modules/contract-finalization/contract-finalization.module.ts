import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractFinalizationComponent } from './contract-finalization.component';
import { NgbdSortableHeaderDirective } from 'src/app/directives/ngbd-sortable-header.directive';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    ContractFinalizationComponent
  ],
  exports: [
    ContractFinalizationComponent
  ],
  imports: [
    CommonModule,
    NgbdSortableHeaderDirective,
    NgxPaginationModule
  ]
})
export class ContractFinalizationModule { }
