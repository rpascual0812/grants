import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusComponent } from './application-status.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UploadDocumentModalComponent } from '../upload-document-modal/upload-document-modal.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [ApplicationStatusComponent, UploadDocumentModalComponent],
    exports: [ApplicationStatusComponent],
    providers: [BsModalService],
    imports: [CommonModule, BsDatepickerModule.forRoot()],
})
export class ApplicationStatusModule {}
