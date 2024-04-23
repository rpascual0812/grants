import { onHiddenDataFundingLiquidation } from './../../../modals/funding-release-liquidation-modal/funding-release-liquidation-modal.component';
import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
    FundingReleaseTrancheModalComponent,
    onHiddenDataFundingRelease,
} from '../../../modals/funding-release-tranche-modal/funding-release-tranche-modal.component';
import { Project, ProjectFunding, ProjectFundingLiquidation } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { FundingReleaseLiquidationModalComponent } from '../../../modals/funding-release-liquidation-modal/funding-release-liquidation-modal.component';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../../utilities/globals';

@Component({
    selector: 'app-funding-release',
    templateUrl: './funding-release.component.html',
    styleUrls: ['./funding-release.component.scss'],
})
export class FundingReleaseComponent implements OnInit {
    loading = false;
    project: Project | null = null;
    projectFunding: ProjectFunding[] | null = [];

    bsModalRef?: BsModalRef;

    SERVER: string = _.BASE_URL;

    grantSignalService = inject(GrantSignalService);
    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private projectService: ProjectService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetchProjectFunding();
    }

    fetchProjectFunding() {
        this.loading = true;
        this.projectService
            .fetchProjectFunding({
                project_pk: this.project?.pk,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectFunding = data?.project_funding;
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Funding Release. Please try again.`,
                            'ERROR!'
                        );
                    }

                    this.loading = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Funding Release. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading = false;
                },
            });
    }

    handleAddTranche() {
        this.openTrancheModal();
    }

    handleEditTranche(pk?: number) {
        this.openTrancheModal(pk);
    }

    handleAddLiquidation() {
        this.openLiquidationModal();
    }

    handleEditLiquidation(projectFundingLiquidation?: ProjectFundingLiquidation) {
        this.openLiquidationModal(projectFundingLiquidation);
    }

    parseCurrencyKey(otherCurrencyLabel?: string) {
        return getOtherCurrencyKey(otherCurrencyLabel ?? '');
    }

    modifyFundingList(funding: ProjectFunding) {
        const existingFunding = this.projectFunding?.find((item) => item.pk === funding?.pk);
        if (!existingFunding) {
            this.projectFunding = [
                ...(this.projectFunding ?? []),
                {
                    ...funding,
                },
            ];
        } else {
            this.projectFunding =
                this?.projectFunding?.map((item) => {
                    if (item.pk === funding?.pk) {
                        item = {
                            ...funding,
                        };
                    }
                    return {
                        ...item,
                    };
                }) ?? [];
        }
    }

    openTrancheModal(pk?: number) {
        const funding = this.projectFunding?.find((item) => item?.pk === pk) ?? null;
        this.bsModalRef = this.modalService.show(FundingReleaseTrancheModalComponent, {
            class: 'modal-xl',
            initialState: {
                funding: {
                    ...funding,
                    project_pk: this.project?.pk,
                },
            },
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: onHiddenDataFundingRelease) => {
            if (data && isSaved) {
                this.modifyFundingList(data);
                this.changeDetection.detectChanges();
            }
        });
    }

    openLiquidationModal(projectFundingLiquidation?: ProjectFundingLiquidation) {
        this.bsModalRef = this.modalService.show(FundingReleaseLiquidationModalComponent, {
            class: 'modal-md',
            initialState: {
                projectPk: this.project?.pk,
                projectFunding: this.projectFunding ?? [],
                projectFundingLiquidation,
            },
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: onHiddenDataFundingLiquidation) => {
            if (data && isSaved) {
                this.projectFunding =
                    this.projectFunding?.map((funding) => {
                        if (funding.pk === data?.project_funding_pk) {
                            funding['project_funding_liquidation'] = data;
                        }
                        return {
                            ...funding,
                        };
                    }) ?? [];
                this.changeDetection.detectChanges();
            }
        });
    }

    uploadFiles(index: number) {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.projectFunding?.[index].project_funding_liquidation?.documents?.push(res.file);
            this.linkAttachment(res.file, this.projectFunding?.[index].project_funding_liquidation);
            this.cdr.detectChanges();
        });
    }

    linkAttachment(file: any, liquidation: any) {
        this.projectService
            .saveLiquidationAttachment({ liquidation_pk: liquidation?.pk, file: file })
            .subscribe({
                next: (data: any) => {

                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading attachments. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    deleteAttachment(funding_index: number, document_index: number) {
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
                    .deleteLiquidationAttachment({ pk: this.projectFunding?.[funding_index].project_funding_liquidation?.documents?.[document_index].pk })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.projectFunding?.[funding_index].project_funding_liquidation?.documents?.splice(document_index, 1);
                            }
                        },
                        error: (error: any) => {
                            console.log(error);
                            this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                        },
                        complete: () => {
                            console.log('Complete');
                        }
                    });
            }
        );

    }
}
