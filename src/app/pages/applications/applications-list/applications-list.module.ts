import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsListComponent } from './applications-list.component';
import { NgbdSortableHeaderDirective } from '../../../directives/ngbd-sortable-header.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ApplicationsListComponent],
    exports: [ApplicationsListComponent],
    imports: [CommonModule, NgbdSortableHeaderDirective, NgxPaginationModule, RouterModule],
})
export class ApplicationsListModule { }
