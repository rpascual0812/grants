import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundReleaseComponent } from './fund-release.component';
import { NgbdSortableHeaderDirective } from 'src/app/directives/ngbd-sortable-header.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';



@NgModule({
  declarations: [
    FundReleaseComponent
  ],
  exports: [
    FundReleaseComponent
  ],
  imports: [
    CommonModule,
    NgbdSortableHeaderDirective,
    NgxPaginationModule,
    AccordionModule
  ]
})
export class FundReleaseModule { }
