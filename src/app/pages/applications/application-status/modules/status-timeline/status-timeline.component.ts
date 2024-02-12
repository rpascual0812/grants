import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { APPLICATION_TIMELINE_STATUS_DATA_MOCK } from '../../../mocks/application-timeline-status-data.mock';
import { UploadDocumentModalComponent } from '../../../upload-document-modal/upload-document-modal.component';

export type Status = 'complete' | 'inprogress' | 'notApproved' | 'approved';

export interface ApplicationStatusButton {
    label: string;
    type: 'info' | 'danger';
    buttonType: 'button' | 'link';
    eventKey: string;
}

export interface ApplicationStatusItem {
    id: string;
    label: string;
    status?: Status;
    button?: ApplicationStatusButton;
}

export interface ApplicationStatusData {
    id: string;
    title: string;
    label?: string;
    button?: ApplicationStatusButton;
    showVerticalLine: boolean;
    status: Status;
    items: ApplicationStatusItem[];
}

@Component({
    selector: 'app-status-timeline',
    templateUrl: './status-timeline.component.html',
    styleUrls: ['./status-timeline.component.scss'],
})
export class StatusTimelineComponent {
    bsModalRef?: BsModalRef;

    data = APPLICATION_TIMELINE_STATUS_DATA_MOCK as ApplicationStatusData[];

    constructor(private modalService: BsModalService) { }

    getStatusIcon(status: Status) {
        if (status === 'approved' || status === 'complete') {
            return 'done';
        }
        if (status === 'notApproved') {
            return 'close';
        }
        return '';
    }

    handleOnButtonEvent(eventKey?: string) {
        // do something with event key, ex: open a modal
        this.openUploadDocumentModal();
    }

    openUploadDocumentModal() {
        this.bsModalRef = this.modalService.show(UploadDocumentModalComponent);
    }
}
