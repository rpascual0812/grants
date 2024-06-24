import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueTranchesComponent } from './overdue-tranches.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [OverdueTranchesComponent],
    imports: [CommonModule, NgxPaginationModule,RouterModule],
    exports: [OverdueTranchesComponent],
})
export class OverdueTranchesModule {}
