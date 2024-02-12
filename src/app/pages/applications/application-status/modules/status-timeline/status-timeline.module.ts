import { UploadDocumentModalComponent } from './../../../upload-document-modal/upload-document-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTimelineComponent } from './status-timeline.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [StatusTimelineComponent, UploadDocumentModalComponent],
    exports: [StatusTimelineComponent],
    imports: [CommonModule, BsDatepickerModule.forRoot()],
})
export class StatusTimelineModule {}
