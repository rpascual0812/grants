import { INTERIM_FINANCIAL_REPORT, INTERIM_NARRATIVE_REPORT } from './../../../utilities/constants';
import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import {
    AVAILABLE_APPLICATION_STATUS,
    AvailableApplicationStatus,
    AvailableProjectStatus,
    GRANT_CLOSING_STATUS,
} from 'src/app/utilities/constants';

const APPROVED_STATUS = 'approved';

type AvailableStatusName = AvailableApplicationStatus | AvailableProjectStatus | 'all';

type ItemStatus = {
    name: string;
    labelText: string;
    labelBgColor: string;
    headerBgColor: string;
    bodyBgColor: string;
    bodyTextColor: string;
    statusName?: AvailableStatusName;
    includeTranche?: boolean;
    count: number;
};

@Component({
    selector: 'app-status-count',
    templateUrl: './status-count.component.html',
    styleUrls: ['./status-count.component.scss'],
})
export class StatusCountComponent implements OnInit {
    applicationStatus: ItemStatus[] = [
        {
            name: 'Grant Application',
            labelText: '1',
            labelBgColor: '#9c4715',
            headerBgColor: '#9c4715',
            bodyBgColor: '#f44335',
            bodyTextColor: 'white',
            count: 0,
        },
        {
            name: 'Received Proposals',
            labelText: '1.1',
            labelBgColor: '#f44335',
            headerBgColor: '#f44335',
            bodyBgColor: 'white',
            bodyTextColor: '#f44335',
            statusName: 'Received Proposals',
            count: 0,
        },
        {
            name: 'Grants Team Review',
            labelText: '1.2',
            labelBgColor: '#da6800',
            headerBgColor: '#da6800',
            bodyBgColor: 'white',
            bodyTextColor: '#da6800',
            statusName: 'Grants Team Review',
            count: 0,
        },
        {
            name: 'Advisers Review',
            labelText: '1.3',
            labelBgColor: '#ff6200',
            headerBgColor: '#ff6200',
            bodyBgColor: 'white',
            bodyTextColor: '#ff6200',
            statusName: 'Advisers Review',
            count: 0,
        },
        {
            name: 'Budget Review and Finalization',
            labelText: '1.4',
            labelBgColor: '#ff9100',
            headerBgColor: '#ff9100',
            bodyBgColor: 'white',
            bodyTextColor: '#ff9100',
            statusName: 'Budget Review and Finalization',
            count: 0,
        },
        {
            name: 'Financial Management Capacity',
            labelText: '1.5',
            labelBgColor: '#ff9100',
            headerBgColor: '#ff9100',
            bodyBgColor: 'white',
            bodyTextColor: '#ff9100',
            statusName: 'Financial Management Capacity',
            count: 0,
        },
        {
            name: 'Due Diligence Final Review',
            labelText: '1.6',
            labelBgColor: '#ff6200',
            headerBgColor: '#ff6200',
            bodyBgColor: 'white',
            bodyTextColor: '#ff6200',
            statusName: 'Due Diligence Final Review',
            count: 0,
        },
    ];

    contractFinalizationStatus: ItemStatus[] = [
        {
            name: 'Contract Finalization',
            labelText: '2',
            labelBgColor: '#7b97e2',
            headerBgColor: '#7b97e2',
            bodyBgColor: '#245b9d',
            bodyTextColor: 'white',
            count: 0,
        },
        {
            name: 'Contract Preparation',
            labelText: '2.1',
            labelBgColor: '#245b9d',
            headerBgColor: '#245b9d',
            bodyBgColor: 'white',
            bodyTextColor: '#245b9d',
            statusName: 'Contract Preparation',
            count: 0,
        },
        {
            name: 'Final Approval',
            labelText: '2.2',
            labelBgColor: '#245b9d',
            headerBgColor: '#245b9d',
            bodyBgColor: 'white',
            bodyTextColor: '#245b9d',
            statusName: 'Final Approval',
            count: 0,
        },
        {
            name: 'Partner Signing',
            labelText: '2.3',
            labelBgColor: '#245b9d',
            headerBgColor: '#245b9d',
            bodyBgColor: 'white',
            bodyTextColor: '#245b9d',
            statusName: 'Partner Signing',
            count: 0,
        },
    ];

    fundReleaseStatus: ItemStatus[] = [
        {
            name: 'Fund Release',
            labelText: '3',
            labelBgColor: '#474ca5',
            headerBgColor: '#474ca5',
            bodyBgColor: '#0b2cb5',
            bodyTextColor: 'white',
            statusName: 'Fund Release',
            count: 0,
        },
        {
            name: 'Release Tranches',
            labelText: '3.1',
            labelBgColor: '#0b2cb5',
            headerBgColor: '#0b2cb5',
            bodyBgColor: 'white',
            bodyTextColor: '#0b2cb5',
            statusName: 'Fund Release',
            includeTranche: true,
            count: 0,
        },
        {
            name: 'Closing Of Grants',
            labelText: '3.2',
            labelBgColor: '#0b2cb5',
            headerBgColor: '#0b2cb5',
            bodyBgColor: 'white',
            bodyTextColor: '#0b2cb5',
            statusName: 'Fund Release',
            includeTranche: true,
            count: 0,
        },
    ];

    constructor(
        private applicationService: ApplicationService,
        private projectService: ProjectService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.fetchApplicationStatusCount();

        this.fetchProjectStatusCount();

        this.fetchProjectFundReleaseStatusCount();

        this.fetchReleaseTranches();

        this.fetchClosingGrants();
    }

    fetchApplicationStatusCount() {
        this.applicationService?.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data as Application[];
                if (status) {
                    const count =
                        data?.filter((application) =>
                            AVAILABLE_APPLICATION_STATUS.includes(application?.status as AvailableApplicationStatus)
                        )?.length ?? 0;

                    this.applicationStatus = this.applicationStatus.map((item) => {
                        const countByStatus =
                            data?.filter((application) => application.status === item.statusName)?.length ?? 0;
                        if (item.name === 'Grant Application') {
                            item.count = count;
                        } else {
                            item.count = countByStatus;
                        }
                        return item;
                    });
                } else {
                    this.toastr.error(
                        `An error occurred while fetching application status count for Application. Please try again.`,
                        'ERROR!'
                    );
                }
            },
            error: (err) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching application status count for Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchProjectStatusCount() {
        this.projectService?.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data as Project[];
                if (status) {
                    const count =
                        data?.filter((project) =>
                            ['Contract Preparation', 'Final Approval', 'Partner Signing'].includes(
                                project?.status as AvailableProjectStatus
                            )
                        )?.length ?? 0;
                    this.contractFinalizationStatus = this.contractFinalizationStatus.map((item) => {
                        const countByStatus =
                            data?.filter((project) => project.status === item.statusName)?.length ?? 0;
                        if (item.name === 'Contract Finalization') {
                            item.count = count;
                        } else {
                            item.count = countByStatus;
                        }
                        return item;
                    });
                } else {
                    this.toastr.error(
                        `An error occurred while fetching application status count for Projects. Please try again.`,
                        'ERROR!'
                    );
                }
            },
            error: (err) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching application status count for Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchReleaseTranches() {
        this.projectService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                if (status) {
                    const releaseTranches = data
                        ?.map((grant) => {
                            const projFundings = (grant?.project_funding ?? []).filter((tranche) => {
                                const currentDate = DateTime.fromJSDate(new Date());
                                const releaseDate = DateTime.fromJSDate(new Date(tranche.released_date as Date));
                                return !tranche?.bank_receipt_pk || releaseDate > currentDate;
                            });
                            if (projFundings.length > 0) {
                                return grant;
                            }
                            return null;
                        })
                        ?.filter((grant) => grant);
                    const releaseTrancheCount = releaseTranches?.length;
                    this.fundReleaseStatus = this.fundReleaseStatus?.map((item) => {
                        if (item.name === 'Release Tranches') {
                            item.count = releaseTrancheCount;
                        }
                        return item;
                    });
                } else {
                    this.toastr.error(`An error occurred while fetching Release Tranches. Please try again.`, 'ERROR!');
                }
            },
            error: (err: any) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Release Tranches. Please try again. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchClosingGrants() {
        this.projectService
            .fetch({
                overall_grant_status: 'Approved',
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = (res?.data ?? []) as Project[];
                    if (status) {
                        const closingOfGrants = data
                            ?.filter((grant) => grant.closing_status === GRANT_CLOSING_STATUS.completed)
                            ?.filter((grant) => {
                                const projFundings = (grant?.project_funding ?? [])
                                    ?.map((funding) => funding?.project_funding_report)
                                    .flat();
                                const nonApprovedNarrativeReport = projFundings.filter(
                                    (report) =>
                                        report?.title === INTERIM_NARRATIVE_REPORT && report?.status !== APPROVED_STATUS
                                );
                                const nonApprovedFinancialReport = projFundings?.filter(
                                    (report) =>
                                        report?.title === INTERIM_FINANCIAL_REPORT && report?.status !== APPROVED_STATUS
                                );
                                return (
                                    nonApprovedNarrativeReport?.length === 0 && nonApprovedFinancialReport?.length === 0
                                );
                            });
                        const closingGrantsCount = closingOfGrants?.length;
                        this.fundReleaseStatus = this.fundReleaseStatus?.map((item) => {
                            if (item.name === 'Closing Of Grants') {
                                item.count = closingGrantsCount;
                            }
                            return item;
                        });
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Closing of Grants. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Closing of Grants. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    fetchProjectFundReleaseStatusCount() {
        this.projectService
            ?.fetchProjectStatusCount({
                status: 'Fund Release',
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.fundReleaseStatus = this.fundReleaseStatus.map((item) => {
                            if (item?.name === 'Fund Release') {
                                item.count = data?.count ?? 0;
                            }
                            return item;
                        });
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching application status count for Fund Release. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const { errorMessage, statusCode } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching application status count for Fund Release. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }
}
