import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import {
    OnHiddenData,
    ProjectBeneficiaryModalComponent,
} from '../../../modals/project-beneficiary-modal/project-beneficiary-modal.component';
import { Project } from 'src/app/interfaces/_project.interface';
import { ProjectBeneficiary } from 'src/app/interfaces/_application.interface';

interface ProjectBeneficiaryTotalCount {
    women_count?: number;
    women_diffable_count?: number;
    women_other_vulnerable_sector_count?: number;
    young_women_count?: number;
    young_women_diffable_count?: number;
    young_women_other_vulnerable_sector_count?: number;
    men_count?: number;
    men_diffable_count?: number;
    men_other_vulnerable_sector_count?: number;
    young_men_count?: number;
    young_men_diffable_count?: number;
    young_men_other_vulnerable_sector_count?: number;
}

@Component({
    selector: 'app-beneficiaries',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class BeneficiariesComponent implements OnInit {
    loading = false;
    project: Project | null = null;
    bsModalRef?: BsModalRef;
    projectBeneficiary: ProjectBeneficiary[] = [];
    projectBeneficiaryTotalCount: ProjectBeneficiaryTotalCount | null = null;

    grantSignalService = inject(GrantSignalService);

    constructor(
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private projectService: ProjectService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetch();
    }

    getBeneficiaryTotal(projectBeneficiary: ProjectBeneficiary[]): ProjectBeneficiaryTotalCount {
        let womenTotalCount = 0;
        let womenDiffableCount = 0;
        let womenOtherVulnerableSectorCount = 0;
        let youngWomenCount = 0;
        let youngWomenDiffableCount = 0;
        let youngWomenOtherVulnerableSectorCount = 0;
        let menCount = 0;
        let menDiffableCount = 0;
        let menOtherVulnerableSectorCount = 0;
        let youngMenCount = 0;
        let youngMenDiffableCount = 0;
        let youngMenOtherVulnerableSectorCount = 0;

        projectBeneficiary?.forEach((beneficiary) => {
            womenTotalCount += beneficiary?.women_count ?? 0;
            womenDiffableCount += beneficiary?.women_diffable_count ?? 0;
            womenOtherVulnerableSectorCount += beneficiary?.women_other_vulnerable_sector_count ?? 0;

            menCount += beneficiary?.men_count ?? 0;
            menDiffableCount += beneficiary?.men_diffable_count ?? 0;
            menOtherVulnerableSectorCount += beneficiary?.men_other_vulnerable_sector_count ?? 0;

            youngWomenCount += beneficiary?.young_women_count ?? 0;
            youngWomenDiffableCount += beneficiary?.young_women_diffable_count ?? 0;
            youngWomenOtherVulnerableSectorCount += beneficiary?.young_men_other_vulnerable_sector_count ?? 0;

            youngMenCount += beneficiary?.young_men_count ?? 0;
            youngMenDiffableCount += beneficiary?.young_men_diffable_count ?? 0;
            youngMenOtherVulnerableSectorCount += beneficiary?.young_men_other_vulnerable_sector_count ?? 0;
        });

        return {
            women_count: womenTotalCount,
            women_diffable_count: womenDiffableCount,
            women_other_vulnerable_sector_count: womenOtherVulnerableSectorCount,
            young_women_count: youngWomenCount,
            young_women_diffable_count: youngWomenDiffableCount,
            young_women_other_vulnerable_sector_count: youngWomenOtherVulnerableSectorCount,
            men_count: menCount,
            men_diffable_count: menDiffableCount,
            men_other_vulnerable_sector_count: menOtherVulnerableSectorCount,
            young_men_count: youngMenCount,
            young_men_diffable_count: youngMenDiffableCount,
            young_men_other_vulnerable_sector_count: youngMenOtherVulnerableSectorCount,
        };
    }

    fetch() {
        this.loading = true;
        this.projectService
            .fetchProjectBeneficiary({
                project_pk: this.project?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const data: ProjectBeneficiary[] = res?.data;
                    const status = res?.status;
                    if (status) {
                        this.projectBeneficiary = data;
                        this.projectBeneficiaryTotalCount = this.getBeneficiaryTotal(data ?? []);
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Project Beneficiary. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project Beneficiary. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading = false;
                },
            });
    }

    handleAddBeneficiary() {
        this.openProjBeneficiaryModal();
    }

    openProjBeneficiaryModal() {
        this.bsModalRef = this.modalService.show(ProjectBeneficiaryModalComponent, {
            class: 'modal-xl',
            initialState: {
                project: this.project,
                projectBeneficiary: this.projectBeneficiary,
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (isSaved) {
                this.projectBeneficiary = data;
                this.projectBeneficiaryTotalCount = this.getBeneficiaryTotal(data);
                this.changeDetection.detectChanges();
            }
        });
    }
}
