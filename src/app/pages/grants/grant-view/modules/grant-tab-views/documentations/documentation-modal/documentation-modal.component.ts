import { Component, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../../../../../../utilities/globals';

@Component({
    selector: 'app-documentation-modal',
    templateUrl: './documentation-modal.component.html',
    styleUrls: ['./documentation-modal.component.scss']
})
export class DocumentationModalComponent {
    title?: string;
    document: any = {};

    closeBtnName?: string;

    url: String = _.BASE_URL;

    constructor(
        private elRef: ElementRef,
        public bsModalRef: BsModalRef,
    ) { }

    ngOnInit(): void {

    }

    onImgError(event: any) {
        event.target.src = this.url + '/assets/images/not-found.png';
    }
}
