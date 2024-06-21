import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsForComponent } from './grants-for.component';
import { BaseChartDirective } from 'ng2-charts';


@NgModule({
    declarations: [
        GrantsForComponent
    ],
    imports: [
        CommonModule,
        BaseChartDirective
    ],
    exports: [GrantsForComponent]
})
export class GrantsForModule { }
