import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../utilities/globals';
import { SelectComponent } from 'src/app/components/select/select.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { EventModalComponent } from '../grants/grant-view/modules/grant-tab-views/attendees/event-modal/event-modal.component';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-data-collection',
    templateUrl: './data-collection.component.html',
    styleUrls: ['./data-collection.component.scss']
})
export class DataCollectionComponent implements OnInit {
    @ViewChild('eventList', { static: false }) eventList: SelectComponent;

    url: string = _.BASE_URL;
    link: string = '';
    form: FormGroup;

    bsModalRef?: BsModalRef;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private projectService: ProjectService
    ) { }

    ngOnInit() {
        this.setForm();
    }

    setForm() {
        this.form = this.formBuilder.group({
            project_pk: ['', [Validators.required]],
            project_event_pk: ['', [Validators.required]],
        });
    }

    get f() {
        return this.form.controls;
    }

    onChangeProjectItem(ev: any) {
        this.form.get('project_pk')?.patchValue(ev[0].pk);

        setTimeout(() => {
            this.eventList.fetch();
        }, 1000);
        this.cdr.detectChanges();
    }

    onChangeEventItem(ev: any) {
        this.form.get('project_event_pk')?.patchValue(ev[0].pk);
        this.link = window.location.protocol + '//' + window.location.host + '/public/project/' + this.form.value.project_pk + '/event/' + this.form.value.project_event_pk;

        this.cdr.detectChanges();
    }

    openEventModal() {
        const title = 'Add Event';

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                project_pk: this.form.value.project_pk,
                event: {},
            }
        };
        this.bsModalRef = this.modalService.show(EventModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                this.eventList.fetch();
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }



}
