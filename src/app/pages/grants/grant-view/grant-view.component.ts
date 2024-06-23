import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService, ProjectForm } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../../utilities/globals';
import { Document, User } from 'src/app/interfaces/_application.interface';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { ProjectEditModalComponent, ProjectEditModalTitleMapperKey } from './modals/project-edit-modal/project-edit-modal.component';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';

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
    bsModalRef?: BsModalRef;
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

    section: ProjectEditModalTitleMapperKey | null = 'topInformation';

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


    grantSignalEffect = effect(
        () => {
            const section = this.grantSignalService.editSectionKey() as ProjectEditModalTitleMapperKey;
            if (section === 'topInformation') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

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

    getOtherCurrency(otherCurrency: string) {
        return getOtherCurrencyKey(otherCurrency);
    }

    toggleFinancialManagementTraining() {
        this.projectService
            .updateFinancialManagementTraining({
                project_pk: this.project?.pk,
                financial_management_training: !this.project?.financial_management_training,
            })
            .subscribe({
                next: (data: any) => { },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }

    handleModal() {
        this.bsModalRef = this.modalService.show(ProjectEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                project: this.project,
                section: this.section,
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (data && isSaved) {
                this.project = data?.project as Project
                this.cdr.detectChanges();
            }
        });

        this.grantSignalService.editSectionKey.set(null);
    }

    setOverallStatus(ev: any, grant: any) {
        ev.stopPropagation();
        const data = {
            pk: grant.pk,
            overall_grant_status: ev.target.value
        }
        this.projectService.setGrantOverallStatus(data).subscribe({
            next: (res: any) => {
                this.toastr.success(
                    `Overall Grant Status successfully saved`,
                    'SUCCESS!'
                );
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err)
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }
}
