import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgingProjectsTranchesComponent } from './aging-projects-tranches.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AgingProjectsTranchesComponent],
    imports: [CommonModule, NgxPaginationModule, RouterModule],
    exports: [AgingProjectsTranchesComponent],
})
export class AgingProjectsTranchesModule {}
