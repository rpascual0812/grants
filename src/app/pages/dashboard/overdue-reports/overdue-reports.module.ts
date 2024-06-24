import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueReportsComponent } from './overdue-reports.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [OverdueReportsComponent],
    imports: [CommonModule, NgxPaginationModule, RouterModule],
    exports: [OverdueReportsComponent],
})
export class OverdueReportsModule {}
