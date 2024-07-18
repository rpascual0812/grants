import { Component, OnInit, ViewEncapsulation, effect, inject } from '@angular/core';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AttendeesModalComponent } from './attendees-modal/attendees-modal.component';
import * as _ from '../../../../../../utilities/globals';
import { ToastrService } from 'ngx-toastr';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { EventModalComponent } from './event-modal/event-modal.component';
import { User } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-attendees',
    templateUrl: './attendees.component.html',
    styleUrls: ['./attendees.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AttendeesComponent implements OnInit {
    bsModalRef?: BsModalRef;

    events: any = [];
    loading: boolean = false;

    event_name: string = '';

    project: Project | null = null;

    grantSignalService = inject(GrantSignalService);

    currentExpandedIdx = -1
    mockRandomEvent: number[] = []

    user: User | null = {};
    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    url: string = '';

    constructor(
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        for (let i = 0; i < 10; i++) {
            this.mockRandomEvent.push(i)
        }

        effect(() => {
            this.user = this.userSignalService.user();

            this.user?.user_role?.forEach((user_role: any) => {
                this.permission.contract_finalization = this.restrictions[user_role.role.restrictions.contract_finalization] > this.restrictions[this.permission.contract_finalization] ? user_role.role.restrictions.contract_finalization : this.permission.contract_finalization;
            });
        });
    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();
        this.fetch();

        this.url = window.location.origin;
    }

    handleIsOpenChange($event: boolean, idx: number) {
        if ($event) {
            this.currentExpandedIdx = idx
        } else {
            this.currentExpandedIdx = -1
        }
    }

    fetch() {
        this.projectService
            .fetchEvents(this.project?.pk)
            .subscribe({
                next: (data: any) => {
                    this.events = data;
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }

    addEvent() {
        if (this.event_name.replace(/\s/g, '') == '') {

        }
        else {
            this.projectService
                .saveEvent({ project_pk: this.project?.pk, pk: null, name: this.event_name })
                .subscribe({
                    next: (data: any) => {
                        data.data.name = this.event_name;
                        data.data.attendees = [];
                        this.events.push(data.data);
                    },
                    error: (error: any) => {
                        console.log(error);
                        setTimeout(() => { this.loading = false; }, 500);
                    },
                    complete: () => {
                        console.log('Complete');
                        setTimeout(() => { this.loading = false; }, 500);
                    }
                });
        }
    }

    openModal(i: number, attendee: any) {
        const event = this.events[i];
        const title = attendee ? 'Edit ' + attendee.name : 'Add attendee';

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                project_pk: this.project?.pk,
                event_pk: event.pk,
                attendee: attendee
            }
        };
        this.bsModalRef = this.modalService.show(AttendeesModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                this.fetch();
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }

    openEventModal(i: number | null) {
        const title = i ? 'Edit ' + this.events[i].name : 'Add Event';

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                project_pk: this.project?.pk,
                event: i !== null ? this.events[i] : {},
            }
        };
        this.bsModalRef = this.modalService.show(EventModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                if (i !== null) {
                    this.events[i] = res.data.data;
                }
                else {
                    this.events.push(res.data.data);
                }
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }

    deleteAttendee(attendee: any) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this attendee?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.projectService.destroyAttendee(attendee).subscribe({
                    next: (data: any) => {
                        this.events.forEach((event: any) => {
                            event.attendees.forEach((_attendee: any, index: number) => {
                                if (_attendee.pk == attendee.pk) {
                                    event.attendees.splice(index, 1);
                                }
                            });
                        });
                    },
                    error: (error: any) => {
                        console.log(error);
                        this.toastr.error('An error occurred while deleting attendee. Please try again', 'ERROR!');
                    },
                    complete: () => {
                        console.log('Complete');
                    },
                });
            }
        );
    }

    deleteEvent(i: number) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this event?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.projectService.destroyEvent(this.events[i]).subscribe({
                    next: (data: any) => {
                        this.events.splice(i, 1);
                    },
                    error: (error: any) => {
                        console.log(error);
                        this.toastr.error('An error occurred while deleting event. Please try again', 'ERROR!');
                    },
                    complete: () => {
                        console.log('Complete');
                    },
                });
            }
        );
    }
}
