import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCountComponent } from './status-count.component';

@NgModule({
    declarations: [StatusCountComponent],
    imports: [CommonModule],
    exports: [StatusCountComponent]
})
export class StatusCountModule {}
