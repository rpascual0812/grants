import { Component, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LinkGeneratorComponent } from 'src/app/components/link-generator/link-generator.component';
@Component({
    selector: 'app-new-link-modal',
    templateUrl: './new-link-modal.component.html',
    styleUrls: ['./new-link-modal.component.scss'],
})
export class NewLinkModalComponent {
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
        this.loading = this.linkGeneratorComponent.loading;
        this.linkGeneratorComponent.submit();
    }

    saved(ev: any) {
        this.callback.emit(ev);
        this.loading = this.linkGeneratorComponent.loading;
    }
}
