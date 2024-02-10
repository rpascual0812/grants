import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusComponent } from './application-status.component';
import { StatusTimelineModule } from '../status-timeline/status-timeline.module';
import { StatusDetailModule } from '../status-detail/status-detail.module';

@NgModule({
  declarations: [ApplicationStatusComponent],
  exports: [ApplicationStatusComponent],
  imports: [CommonModule, StatusTimelineModule, StatusDetailModule],
})
export class ApplicationStatusModule { }
