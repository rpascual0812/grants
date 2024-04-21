import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PartnerAssessment, User } from 'src/app/interfaces/_application.interface';
import { PartnerService } from 'src/app/services/partner.service';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { OnHiddenData } from '../../grant-view.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { UserService } from 'src/app/services/user.service';
import { ProjectEditModalComponent } from '../../modals/project-edit-modal/project-edit-modal.component';
import { Project } from 'src/app/interfaces/_project.interface';

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
    partnerAssessments: PartnerAssessment[];
    partnerAssessment: PartnerAssessment | null = {
        message: '',
    };
    user: User | null = null;

    partnerSignalService = inject(PartnerSignalService);
    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private partnerService: PartnerService,
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {

        console.log('project', this.project);
        this.partner = this.project?.partner;
        this.fetchUser();
        this.fetch();
    }

    fetchUser() {
        this.loading = true;
        this.userService.fetch().subscribe({
            next: (data: any) => {
                this.user = data;
                this.loading = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching user. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    fetch() {
        this.loading = true;
        this.partnerService.fetchPartnerAssessments(this.partner?.pk).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.partnerAssessments = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Assessments. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Assessments. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    modifyList(data: PartnerAssessment) {
        const partnerAssessment = data;
        const existingAssessment = this.partnerAssessments?.find((item) => item.pk === partnerAssessment?.pk);
        if (!existingAssessment) {
            this.partnerAssessments = [
                {
                    ...partnerAssessment,
                    user: {
                        ...this.user,
                    },
                },
                ...this.partnerAssessments,
            ];
        } else {
            this.partnerAssessments = this?.partnerAssessments?.map((item) => {
                if (item.pk === partnerAssessment?.pk) {
                    item = {
                        ...partnerAssessment,
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
                partnerAssessment: this.partnerAssessment,
                section,
            },
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (data?.partnerAssessment && isSaved) {
                this.modifyList(data?.partnerAssessment);
                this.changeDetection.detectChanges();
            }
        });
        this.partnerSignalService.editSectionKey.set(null);
    }

    handleAdd() {
        this.partnerAssessment = {
            partner_pk: this.partner?.pk,
            message: '',
        };
        this.handleOpenModal();
    }

    handleEdit(pk?: number) {
        this.partnerAssessment = this.partnerAssessments.find((item) => item?.pk === pk) ?? null;
        this.handleOpenModal();
    }
}
