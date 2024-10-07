import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantTypesComponent } from './grant-types.component';
import { BaseChartDirective } from 'ng2-charts';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [GrantTypesComponent],
    exports: [GrantTypesComponent],
    imports: [CommonModule, BaseChartDirective, NgbTooltip],
})
export class GrantTypesModule {}
