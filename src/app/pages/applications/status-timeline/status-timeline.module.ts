import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTimelineComponent } from './status-timeline.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UploadDocumentModalComponent } from '../upload-document-modal/upload-document-modal.component';



@NgModule({
  declarations: [
    StatusTimelineComponent,
    UploadDocumentModalComponent
  ],
  exports: [StatusTimelineComponent],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class StatusTimelineModule { }
