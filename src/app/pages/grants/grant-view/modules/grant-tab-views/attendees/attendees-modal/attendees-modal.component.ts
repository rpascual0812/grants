import { Component, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../../../../../utilities/globals';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-attendees-modal',
    templateUrl: './attendees-modal.component.html',
    styleUrls: ['./attendees-modal.component.scss']
})
export class AttendeesModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    title?: string;
    project_pk: any = null;
    event_pk: any = null;
    attendee: any = {};

    loading: boolean = false;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;
    url: String = _.BASE_URL;
    filters: any = {};

    submitted: boolean = false;
    form: FormGroup;

    dateConfig: any = { isAnimated: true, containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY/MM/DD' };

    onFocus: Function = _.onFocus;
    onExit: Function = _.onExit;

    constructor(
        private elRef: ElementRef,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private projectService: ProjectService
    ) { }

    ngOnInit(): void {
        this.filters = {
            search: '',
            skip: 0,
            take: 10
        };

        this.setForm();
    }



    setForm() {
        this.attendee.birthday = new Date(this.attendee.birthday ? this.attendee.birthday : DateTime.now());
        this.form = this.formBuilder.group({
            pk: [''],
            project_event_pk: [this.event_pk],
            name: [this.attendee ? this.attendee.name : '', Validators.required],
            birthday: [this.attendee ? new Date(this.attendee.birthday) : '', Validators.required],
            address: [this.attendee ? this.attendee.address : '', Validators.required],
            mobile_number: [this.attendee ? this.attendee.mobile_number : '', Validators.required],
            archived: [this.attendee ? this.attendee.archived : false]
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        let formattedDate = formatDate(this.form.value.birthday, 'yyyy-MM-dd', "en-US");
        this.form.get('birthday')?.patchValue(formattedDate);
        this.form.get('pk')?.patchValue(this.attendee.pk);

        this.projectService
            .saveAttendee(this.project_pk, this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The attendee has been successfully ' + (this.attendee.pk ? 'updated' : 'added'), 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the Attendee. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                    this.bsModalRef.hide();
                }
            });
    }
}
