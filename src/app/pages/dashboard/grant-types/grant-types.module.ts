import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantTypesComponent } from './grant-types.component';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
    declarations: [GrantTypesComponent],
    exports: [GrantTypesComponent],
    imports: [CommonModule, BaseChartDirective],
})
export class GrantTypesModule {}
