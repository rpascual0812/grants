import { Component, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../../../../../utilities/globals';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-event-modal',
    templateUrl: './event-modal.component.html',
    styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    title?: string;
    project_pk: any = null;
    event: any = null;

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
        console.log(this.event);

        this.setForm();
    }

    setForm() {
        this.form = this.formBuilder.group({
            pk: [''],
            name: [this.event ? this.event.name : '', Validators.required],
            archived: [this.event ? this.event.archived : false]
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.form.get('pk')?.patchValue(this.event.pk);

        this.projectService
            .saveEvent({ project_pk: this.project_pk, pk: this.event.pk, name: this.form.value.name })
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The event has been successfully ' + (this.event.pk ? 'updated' : 'added'), 'SUCCESS!');
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
