import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectCode } from 'src/app/interfaces/_project.interface';
import { GrantSignalService, ProjectForm } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../../utilities/globals';
import { Document, Type, User } from 'src/app/interfaces/_application.interface';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { ProjectEditModalComponent } from './modals/project-edit-modal/project-edit-modal.component';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { GlobalService } from 'src/app/services/global.service';

export const PROJECT_EDIT_SECTION_MAPPER = {
    projectCodes: `Grant Number/Code`,
    topInformation: `Edit`,
    projectInformation: `Project Information`,
    activitiesAndTimeline: `Activities and Timeline`,
    assessment: `Assessment`,
};

export type ProjectEditSectionMapperKey = keyof typeof PROJECT_EDIT_SECTION_MAPPER;

type SelectItem = {
    pk: number;
    name: string;
};

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
    loadingGrantTypes = true;
    loadingProjectCodes = true;
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

    section: ProjectEditSectionMapperKey | null = 'topInformation';
    grantTypes: Type[] = [];
    projectCodes: ProjectCode[] = [];

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private projectService: ProjectService,
        private globalService: GlobalService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.pk = this.route.snapshot.paramMap.get('pk') ?? '';

        effect(() => {
            this.user = this.userSignalService.user();

            this.user?.user_role?.forEach((user_role: any) => {
                this.permission.contract_finalization =
                    this.restrictions[user_role.role.restrictions.contract_finalization] >
                        this.restrictions[this.permission.contract_finalization]
                        ? user_role.role.restrictions.contract_finalization
                        : this.permission.contract_finalization;
            });
        });
    }

    grantSignalEffect = effect(
        () => {
            const section = this.grantSignalService.editSectionKey() as ProjectEditSectionMapperKey;
            if (section === 'topInformation') {
                this.handleModal();
            }

            if (section === 'projectCodes') {
                this.fetchProjectCodes();
                this.grantSignalService.editSectionKey.set(null);
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
        this.fetchProjectCodes();
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

    fetchProjectCodes() {
        this.loadingProjectCodes = true;
        this.projectService
            .fetchProjectCodes({
                project_pk: +this.pk,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data as ProjectCode[];
                    const status = res?.status;
                    if (status) {
                        this.projectCodes = data ?? [];
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Project Codes. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loadingProjectCodes = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project Codes. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loadingProjectCodes = false;
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

    handleOnEdit($event: MouseEvent, section: ProjectEditSectionMapperKey) {
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
                this.project = data?.project as Project;
                this.cdr.detectChanges();
            }
        });

        this.grantSignalService.editSectionKey.set(null);
    }

    setOverallStatus(ev: any, grant: any) {
        ev.stopPropagation();
        const data = {
            pk: grant.pk,
            overall_grant_status: ev.target.value,
        };
        this.projectService.setGrantOverallStatus(data).subscribe({
            next: (res: any) => {
                this.toastr.success(`Overall Grant Status successfully saved`, 'SUCCESS!');
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    onSelectItem($event: SelectItem[]) {
        const pk = $event?.at(0)?.pk;
        this.setGrantType(pk as number);
    }

    setGrantType(grantTypePk: number) {
        this.projectService
            .setGrantType({
                project_pk: this.project?.pk as number,
                pk: grantTypePk,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.toastr.success(`Grant Function successfully saved`, 'SUCCESS!');
                    } else {
                        this.toastr.error(`An error occurred while saving Grant Function. Please try again.`, 'ERROR!');
                    }
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Grant Function. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }
}
