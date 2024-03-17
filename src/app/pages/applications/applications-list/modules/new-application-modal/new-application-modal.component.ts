import { Component, EventEmitter, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { LinkGeneratorComponent } from 'src/app/components/link-generator/link-generator.component';

@Component({
    selector: 'app-new-application-modal',
    templateUrl: './new-application-modal.component.html',
    styleUrls: ['./new-application-modal.component.scss']
})
export class NewApplicationModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    title?: string;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;

    @ViewChild(LinkGeneratorComponent) linkGeneratorComponent: LinkGeneratorComponent;

    constructor(
        public bsModalRef: BsModalRef,
    ) { }

    ngOnInit(): void {

    }

    partnerSelected(event: any) {
        this.linkGeneratorComponent.partnerSelected(event);
    }

    submit() {
        this.linkGeneratorComponent.submit();
    }
}
