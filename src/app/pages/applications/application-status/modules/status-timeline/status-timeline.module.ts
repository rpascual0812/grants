import { UploadDocumentModalComponent } from '../../../modals/upload-document-modal/upload-document-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTimelineComponent } from './status-timeline.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [StatusTimelineComponent, UploadDocumentModalComponent],
    exports: [StatusTimelineComponent],
    imports: [CommonModule, BsDatepickerModule.forRoot(), RouterModule],
})
export class StatusTimelineModule { }
