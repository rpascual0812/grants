import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectAssessment, User } from 'src/app/interfaces/_application.interface';
import { PartnerService } from 'src/app/services/partner.service';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { OnHiddenData } from '../../grant-view.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { UserService } from 'src/app/services/user.service';
import { ProjectEditModalComponent } from '../../modals/project-edit-modal/project-edit-modal.component';
import { Project } from 'src/app/interfaces/_project.interface';
import { UserSignalService } from 'src/app/services/user.signal.service';
import * as _ from '../../../../../utilities/globals';

@Component({
    selector: 'app-assessment',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent {
    @Input() project: Project | null = null;

    bsModalRef?: BsModalRef;
    loading = false;
    partner: any = null;
    projectAssessments: ProjectAssessment[] | [];
    projectAssessment: ProjectAssessment | {} = {};
    user: User | null = null;
    donors: any = [];

    partnerSignalService = inject(PartnerSignalService);

    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private partnerService: PartnerService,
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.partner = this.project?.partner;
        this.user = this.userSignalService.user();

        this.user?.user_role?.forEach((user_role: any) => {
            this.permission.contract_finalization = this.restrictions[user_role.role.restrictions.contract_finalization] > this.restrictions[this.permission.contract_finalization] ? user_role.role.restrictions.contract_finalization : this.permission.contract_finalization;
        });

        this.projectAssessments = this.project?.project_assessment ?? [];
        // this.projectAssessments = this.project?.project_assessment;
        // this.fetch();

        this.project?.project_funding!.forEach((funding: any) => {
            if (!this.donors.includes(funding.donor.name)) {
                this.donors.push(funding.donor.name);
            }
        });
    }

    // fetch() {
    //     this.loading = true;
    //     this.partnerService.fetchProjectAssessments(this.partner?.pk).subscribe({
    //         next: (res: any) => {
    //             const status = res?.status;
    //             const data = res?.data;
    //             if (status) {
    //                 this.projectAssessments = data;
    //             } else {
    //                 this.toastr.error(`An error occurred while fetching Assessments. Please try again.`, 'ERROR!');
    //             }
    //             this.loading = false;
    //         },
    //         error: (err) => {
    //             const { statusCode, errorMessage } = extractErrorMessage(err);
    //             this.toastr.error(
    //                 `An error occurred while fetching Assessments. ${statusCode} ${errorMessage} Please try again.`,
    //                 'ERROR!'
    //             );
    //             this.loading = false;
    //         },
    //     });
    // }

    modifyList(data: ProjectAssessment) {
        const projectAssessment = data;
        const existingAssessment = this.projectAssessments?.find((item) => item.pk === projectAssessment?.pk);
        if (!existingAssessment) {
            this.projectAssessments = [
                {
                    ...projectAssessment,
                    user: {
                        ...this.user,
                    },
                },
                ...this.projectAssessments,
            ];
        } else {
            this.projectAssessments = this?.projectAssessments?.map((item) => {
                if (item.pk === projectAssessment?.pk) {
                    item = {
                        ...projectAssessment,
                        user: {
                            ...this.user,
                        },
                    };
                }
                return {
                    ...item,
                };
            });
        }
    }

    handleOpenModal() {
        const section = 'assessment';
        this.bsModalRef = this.modalService.show(ProjectEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                project: this.project,
                projectAssessment: this.projectAssessment,
                section,
            },
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (data?.project_assessment && isSaved) {
                this.modifyList(data?.projectAssessment ?? {});
                this.changeDetection.detectChanges();
            }
        });
        this.partnerSignalService.editSectionKey.set(null);
    }

    handleAdd() {
        this.projectAssessment = {
            project_pk: this.project?.pk,
            message: '',
        };
        this.handleOpenModal();
    }

    handleEdit(pk?: number) {
        this.projectAssessment = this.projectAssessments.find((item) => item?.pk === pk) ?? {};
        this.handleOpenModal();
    }
}
