import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationsComponent } from './evaluations.component';

@NgModule({
    declarations: [EvaluationsComponent],
    exports: [EvaluationsComponent],
    imports: [CommonModule],
})
export class EvaluationsModule {}
