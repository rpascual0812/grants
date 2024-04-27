import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AttendeesModalComponent } from './attendees-modal/attendees-modal.component';
import * as _ from '../../../../../../utilities/globals';
import { ToastrService } from 'ngx-toastr';

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

    project: Project | null = null;

    grantSignalService = inject(GrantSignalService);

    currentExpandedIdx = -1
    mockRandomEvent: number[] = []
    constructor(
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        for (let i = 0; i < 10; i++) {
            this.mockRandomEvent.push(i)
        }
    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();
        this.fetch();
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

    openModal(attendee: any) {
      const title = attendee ? 'Edit ' + attendee.name : 'Add attendee';

      const initialState: ModalOptions = {
          class: 'modal-lg',
          initialState: {
              title: title,
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
                      if(_attendee.pk == attendee.pk) {
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
}
