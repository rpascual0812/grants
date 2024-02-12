import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusComponent } from './application-status.component';
import { StatusDetailModule } from './modules/status-detail/status-detail.module';
import { StatusTimelineModule } from './modules/status-timeline/status-timeline.module';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
    declarations: [ApplicationStatusComponent],
    exports: [ApplicationStatusComponent],
    providers: [BsModalService],
    imports: [CommonModule, StatusTimelineModule, StatusDetailModule],
})
export class ApplicationStatusModule {}
