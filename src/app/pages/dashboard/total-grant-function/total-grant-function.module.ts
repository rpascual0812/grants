import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalGrantFunctionComponent } from './total-grant-function.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [TotalGrantFunctionComponent],
    exports: [TotalGrantFunctionComponent],
    imports: [CommonModule, NgbTooltip],
})
export class TotalGrantFunctionModule {}
