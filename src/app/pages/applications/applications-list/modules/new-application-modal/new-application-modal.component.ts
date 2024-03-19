import { Component, EventEmitter, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { LinkGeneratorComponent } from 'src/app/components/link-generator/link-generator.component';
import { APPLICATION_REVIEW_LIST_KEY } from 'src/app/services/link-generator.signal.service';

@Component({
    selector: 'app-new-application-modal',
    templateUrl: './new-application-modal.component.html',
    styleUrls: ['./new-application-modal.component.scss'],
})
export class NewApplicationModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    title?: string;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;

    @ViewChild(LinkGeneratorComponent) linkGeneratorComponent: LinkGeneratorComponent;

    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit() {}

    partnerSelected(event: any) {
        this.linkGeneratorComponent.partnerSelected(event);
    }

    submit() {
        this.linkGeneratorComponent.refetchKey = APPLICATION_REVIEW_LIST_KEY;
        this.linkGeneratorComponent.submit();
    }
}
