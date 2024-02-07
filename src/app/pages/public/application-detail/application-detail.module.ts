import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationDetailComponent } from './application-detail.component';

@NgModule({
    declarations: [ApplicationDetailComponent],
    exports: [ApplicationDetailComponent],
    imports: [CommonModule],
})
export class ApplicationDetailModule {}
