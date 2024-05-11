import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GrantTypesModule } from './grant-types/grant-types.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, GrantTypesModule],
})
export class DashboardModule {}
