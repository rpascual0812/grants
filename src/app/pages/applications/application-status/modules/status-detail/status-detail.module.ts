import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDetailComponent } from './status-detail.component';

@NgModule({
    declarations: [StatusDetailComponent],
    exports: [StatusDetailComponent],
    imports: [CommonModule],
})
export class StatusDetailModule {}
