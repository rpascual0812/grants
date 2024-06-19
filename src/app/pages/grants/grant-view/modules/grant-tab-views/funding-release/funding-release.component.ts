import { onHiddenDataFundingLiquidation } from './../../../modals/funding-release-liquidation-modal/funding-release-liquidation-modal.component';
import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
    FundingReleaseTrancheModalComponent,
    GroupedFundingReport,
    onHiddenDataFundingRelease,
} from '../../../modals/funding-release-tranche-modal/funding-release-tranche-modal.component';
import {
    Project,
    ProjectFunding,
    ProjectFundingLiquidation,
    ProjectFundingReport,
} from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { FundingReleaseLiquidationModalComponent } from '../../../modals/funding-release-liquidation-modal/funding-release-liquidation-modal.component';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../../utilities/globals';
import { DateTime } from 'luxon';
import { EditDeadlineModalComponent } from '../../../modals/edit-deadline-modal/edit-deadline-modal.component';
import { UserSignalService } from 'src/app/services/user.signal.service';

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

    user: any = {};
    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private projectService: ProjectService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef
    ) { }

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetchProjectFunding();

        this.user = this.userSignalService.user();

        this.user?.user_role?.forEach((user_role: any) => {
            this.permission.fund_release = this.restrictions[user_role.role.restrictions.fund_release] > this.restrictions[this.permission.fund_release] ? user_role.role.restrictions.fund_release : this.permission.fund_release;
        });
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

    getNextReportDueDate() {
        // fetches the nearest report due date that is greater than or equal to the current date
        // example:
        // current date: 23-APR-2024
        // report due dates: [27-APR-2024, 28-APR-2024, 29-APR-2024]
        // report due date: 27-APR-2024
        const nextReportDue = this.projectFunding
            ?.filter((funding) => {
                const currentDate = DateTime.now();
                const parsedDueDate = (funding?.report_due_date &&
                    DateTime.fromISO(String(funding?.report_due_date))) as DateTime;
                return currentDate?.startOf('day') <= parsedDueDate?.startOf('day');
            })
            .sort((reportA, reportB) => {
                const reportDueDateA = DateTime.fromISO(String(reportA?.report_due_date));
                const reportDueDateB = DateTime.fromISO(String(reportB?.report_due_date));
                return reportDueDateA.startOf('day') <= reportDueDateB.startOf('day') ? -1 : 1;
            });
        return nextReportDue?.at(0)?.report_due_date ?? null;
    }

    getLastTrancheDate() {
        // fetches the nearest date created value that is equal or less than to the current date
        // example:
        // current date: 23-APR-2024
        // date created dates: [23-APR-2024, 22-APR-2024, 21-APR-2024]
        // tranche date: 23-APR-2024
        const lastTrancheDate = this.projectFunding
            ?.filter((funding) => {
                const currentDate = DateTime.now();
                const parsedDateCreated = (funding?.date_created &&
                    DateTime.fromISO(String(funding?.date_created))) as DateTime;
                return currentDate?.startOf('day') >= parsedDateCreated?.startOf('day');
            })
            .sort((reportA, reportB) => {
                const reportDueDateA = DateTime.fromISO(String(reportA?.date_created));
                const reportDueDateB = DateTime.fromISO(String(reportB?.date_created));
                return reportDueDateA.startOf('day') >= reportDueDateB.startOf('day') ? -1 : 1;
            });
        return lastTrancheDate?.at(0)?.date_created ?? null;
    }

    getOverdueReport() {
        // fetches the nearest report due date that is less than or equal to the current date
        // and has values for grantee_acknowledgement or bank_receipt
        const overdueReport = this.projectFunding
            ?.filter((funding) => {
                const currentDate = DateTime.now();
                const parsedDueDate = (funding?.report_due_date &&
                    DateTime.fromISO(String(funding?.report_due_date))) as DateTime;
                return currentDate?.startOf('day') >= parsedDueDate?.startOf('day');
            })
            ?.filter((funding) => {
                return funding?.grantee_acknowledgement || funding?.bank_receipt_pk;
            })
            ?.sort((reportA, reportB) => {
                const reportDueDateA = DateTime.fromISO(String(reportA?.date_created));
                const reportDueDateB = DateTime.fromISO(String(reportB?.date_created));
                return reportDueDateA?.startOf('day') >= reportDueDateB?.startOf('day') ? -1 : 1;
            });

        return overdueReport?.at(0) ?? null;
    }

    parseCurrencyKey(otherCurrencyLabel?: string) {
        return getOtherCurrencyKey(otherCurrencyLabel ?? '');
    }

    groupedFundingReport(projFundingReport: ProjectFundingReport[]) {
        return projFundingReport.reduce((acc, value) => {
            if (value?.title) {
                (acc[value?.title] = acc[value?.title] || []).push(value);
            }
            return acc;
        }, {} as GroupedFundingReport);
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
            if (data?.pk && isSaved) {
                this.modifyFundingList(data);
                this.changeDetection.detectChanges();
            }
        });
    }

    openEditDeadlineModal(pk?: number) {
        const funding = this.projectFunding?.find((item) => item?.pk === pk) ?? null;
        this.bsModalRef = this.modalService.show(EditDeadlineModalComponent, {
            class: 'modal-md',
            initialState: {
                funding: {
                    ...funding,
                    project_pk: this.project?.pk,
                },
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: onHiddenDataFundingRelease) => {
            if (data?.pk && isSaved) {
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
                            funding['project_funding_liquidation']?.push(data);
                        }
                        return {
                            ...funding,
                        };
                    }) ?? [];
                this.changeDetection.detectChanges();
            }
        });
    }

    uploadFiles(funding: number, liquidation: number) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            const funding_liquidation: any = this.projectFunding?.[funding].project_funding_liquidation ?? {};
            funding_liquidation[liquidation]?.documents?.push(res.file);
            this.linkAttachment(res.file, funding_liquidation[liquidation]);
            this.changeDetection.detectChanges();
        });
    }

    linkAttachment(file: any, liquidation: any) {
        this.projectService.saveLiquidationAttachment({ liquidation_pk: liquidation?.pk, file: file }).subscribe({
            next: (data: any) => { },
            error: (error: any) => {
                console.log(error);
                this.toastr.error('An error occurred while uploading attachments. Please try again', 'ERROR!');
            },
            complete: () => {
                console.log('Complete');
            },
        });
    }

    deleteAttachment(funding_index: number, liquidation_index: number, document_index: number) {
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
                const funding_liquidation: any = this.projectFunding?.[funding_index].project_funding_liquidation ?? {};

                this.projectService
                    .deleteLiquidationAttachment({
                        pk: funding_liquidation[liquidation_index]?.documents?.[
                            document_index
                        ].pk,
                    })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                funding_liquidation[liquidation_index]?.documents?.splice(
                                    document_index,
                                    1
                                );
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

    getAmount(liquidations: any, key: string) {
        let amount = 0;
        liquidations.forEach((liquidation: any) => {
            amount += parseFloat(liquidation['amount_usd']);
        });
        return amount;
    }

    getOtherAmount(liquidations: any) {
        let currencies: any = {};
        liquidations.forEach((liquidation: any) => {
            if (!currencies[liquidation.amount_other_currency]) {
                currencies[liquidation.amount_other_currency] = 0;
            }
            currencies[liquidation.amount_other_currency] += parseFloat(liquidation.amount_other);
        });

        let final_currency: any = [];
        const keys = Object.keys(currencies);
        keys.forEach((key: any) => {
            final_currency.push({
                currency: key,
                amount: currencies[key]
            });
        });
        return final_currency;
    }
}
