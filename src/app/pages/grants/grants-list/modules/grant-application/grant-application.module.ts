import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantApplicationComponent } from './grant-application.component';
import { NgbdSortableHeaderDirective } from 'src/app/directives/ngbd-sortable-header.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    GrantApplicationComponent
  ],
  exports: [
    GrantApplicationComponent
  ],
  imports: [
    CommonModule,
    NgbdSortableHeaderDirective,
    NgxPaginationModule,
    RouterModule,
  ],
})
export class GrantApplicationModule { }
