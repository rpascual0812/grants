import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService, ProjectForm } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../../utilities/globals';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { Document, User } from 'src/app/interfaces/_application.interface';
import { UserSignalService } from 'src/app/services/user.signal.service';

export type OnHiddenData = {
    isSaved: boolean;
    data: ProjectForm;
};
@Component({
    selector: 'app-grant-view',
    templateUrl: './grant-view.component.html',
    styleUrls: ['./grant-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantViewComponent implements OnInit {
    loading = true;
    project: Project | null = null;
    pk = '';
    currentExpanded = new Set();
    attachments: Document[] = [];

    SERVER: string = _.BASE_URL;

    userSignalService = inject(UserSignalService);
    grantSignalService = inject(GrantSignalService);

    user: User | null = {};

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.pk = this.route.snapshot.paramMap.get('pk') ?? '';
    }

    ngOnInit() {
        this.user = this.userSignalService.user();

        this.user?.user_role?.forEach((user_role: any) => {
            this.permission.contract_finalization =
                this.restrictions[user_role.role.restrictions.contract_finalization] >
                this.restrictions[this.permission.contract_finalization]
                    ? user_role.role.restrictions.contract_finalization
                    : this.permission.contract_finalization;
        });

        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.projectService.fetchOne(this.pk).subscribe({
            next: (res: any) => {
                const data = res?.data as Project;
                const status = res?.status;
                if (status) {
                    this.attachments = res?.data.documents ?? [];
                    this.project = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Grant Project. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    handleIsOpenChange($event: boolean, section: string) {
        if ($event) {
            this.currentExpanded.add(section);
        } else {
            this.currentExpanded.delete(section);
        }
    }

    handleOnEdit($event: MouseEvent, section: string) {
        $event.stopPropagation();
        this.grantSignalService.editSectionKey.set(section);
    }

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.linkAttachment(res.file, type);
        });
    }

    linkAttachment(file: any, type: string) {
        this.projectService
            .saveSignedContractAttachment({ project_pk: this.project?.pk, file: file, type: type })
            .subscribe({
                next: (data: any) => {
                    this.attachments.push(file);
                    this.cdr.detectChanges();
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading attachments. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }

    deleteAttachment(i: number, type: string) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this attachment?</strong>',
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
                this.projectService
                    .deleteProjectAttachment({
                        project_pk: this.project?.pk,
                        document_pk: this.attachments[i].pk,
                        type: 'document',
                    })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.attachments.splice(i, 1);
                            }
                        },
                        error: (error: any) => {
                            console.log(error);
                            this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                        },
                        complete: () => {
                            console.log('Complete');
                        },
                    });
            }
        );
    }

    toggleFinancialManagementTraining() {
        this.projectService
            .updateFinancialManagementTraining({
                project_pk: this.project?.pk,
                financial_management_training: !this.project?.financial_management_training,
            })
            .subscribe({
                next: (data: any) => {},
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }
}
