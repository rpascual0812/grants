import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../../utilities/globals';
import { SelectComponent } from 'src/app/components/select/select.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { EventModalComponent } from '../../grants/grant-view/modules/grant-tab-views/attendees/event-modal/event-modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-data-collection',
    templateUrl: './data-collection.component.html',
    styleUrls: ['./data-collection.component.scss']
})
export class DataCollectionComponent implements OnInit {
    @ViewChild('eventList', { static: false }) eventList: SelectComponent;

    dateNow: string | null = null;
    submitted: boolean = false;

    project_pk: any = null;
    project_event_pk: any = null;

    form: FormGroup;

    years: any = [];
    months: string[] = _.MONTHS;
    days: number[] = [];

    mobilePrefix: string = '+63';

    prefixes: string[] = [
        '+63 Philippines'
    ];

    filters: any = ['Male', 'Indigenous People', 'Female', 'Non-IP', 'Men Youth 12-29 yrs old', 'Diffables', 'Women Youth 12-29 yrs old'];
    selected: any = [];
    attendees: any = [];

    bsModalRef?: BsModalRef;

    constructor(
        private route: ActivatedRoute,
        public formBuilder: FormBuilder,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private projectService: ProjectService
    ) { }

    ngOnInit() {
        this.dateNow = DateTime.now().toFormat('ccc, LLLL dd, yyyy');

        const year = parseInt(DateTime.now().toFormat('yyyy'));
        for (let i = year; i > year - 150; i--) {
            this.years.push(i);
        }

        this.project_pk = this.route.snapshot.params['project_pk'];
        this.project_event_pk = this.route.snapshot.params['event_pk'];

        this.setForm();
        this.fetchAttendees();
    }

    setForm() {
        this.form = this.formBuilder.group({
            project_event_pk: [this.project_event_pk],
            name: ['', [Validators.required]],
            birthday: [''],
            year: [null, [Validators.required]],
            month: [null, [Validators.required]],
            day: [null, [Validators.required]],
            address: [''],
            city: ['', [Validators.required]],
            province: ['', [Validators.required]],
            mobile_number: ['', [Validators.required]],
            filters: [[]]
        });
    }

    get f() {
        return this.form.controls;
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

    updateFilter(filter: string) {
        if (this.selected.includes(filter)) {
            this.selected = this.selected.filter((sel: any) => sel !== filter);
        }
        else {
            this.selected.push(filter);
        }

        this.form.get('filters')?.patchValue(this.selected);
    }

    yearOnChange(ev: any) {
        this.monthOnChange(this.form.value.month);
    }

    monthOnChange(ev: any) {
        const year = this.form.value.year ?? DateTime.now().toFormat('yyyy');
        const maxDay: number = DateTime.fromFormat(year + '-' + ev, 'yyyy-LLLL').endOf('month').day;
        let days: any = [];
        for (let i = 1; i <= maxDay; ++i) {
            days.push(i);
        }

        this.days = days;
        this.cdr.detectChanges();
    }

    submit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const birthday = DateTime.fromFormat(this.form.value.year + '-' + this.form.value.month + '-' + this.form.value.day, 'yyyy-LLLL-d').toFormat('yyyy-MM-dd');
        this.form.get('birthday')?.patchValue(birthday);
        this.form.get('address')?.patchValue(this.form.value.city + ' ' + this.form.value.province);

        this.projectService
            .saveAttendee(this.project_pk, this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The attendee has been successfully added', 'SUCCESS!');
                    this.reset();
                    this.fetchAttendees();
                },
                error: (error: any) => {
                    this.toastr.error('An error occurred while saving the Attendee. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    reset() {
        this.form.get('name')?.patchValue('');
        this.form.get('birthday')?.patchValue('');
        this.form.get('year')?.patchValue('');
        this.form.get('month')?.patchValue('');
        this.form.get('day')?.patchValue('');
        this.form.get('address')?.patchValue('');
        this.form.get('city')?.patchValue('');
        this.form.get('province')?.patchValue('');
        this.form.get('mobile_number')?.patchValue('');
        this.form.get('filters')?.patchValue([]);

        this.submitted = false;
    }

    fetchAttendees() {
        this.projectService
            .fetchEvents(this.project_pk)
            .subscribe({
                next: (data: any) => {
                    this.attendees = data.filter((event: any) => event.pk == this.project_event_pk)[0].attendees ?? [];
                },
                error: (error: any) => {
                    this.toastr.error('An error occurred while fetching Attendees. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }
}
