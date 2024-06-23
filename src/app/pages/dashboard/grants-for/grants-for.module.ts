import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsForComponent } from './grants-for.component';
import { BaseChartDirective } from 'ng2-charts';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        GrantsForComponent
    ],
    imports: [
        CommonModule,
        NgbPopoverModule,
        BaseChartDirective
    ],
    exports: [GrantsForComponent]
})
export class GrantsForModule { }
