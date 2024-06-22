import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { AvailableApplicationStatus, AvailableProjectStatus } from 'src/app/utilities/constants';

type ItemStatus = {
    name: string;
    labelText: string;
    labelBgColor: string;
    headerBgColor: string;
    bodyBgColor: string;
    bodyTextColor: string;
    statusName?: AvailableApplicationStatus | AvailableProjectStatus;
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
    ];

    constructor(
        private applicationService: ApplicationService,
        private projectService: ProjectService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.applicationStatus.forEach((item) => {
            this.fetchApplicationStatusCount(item.name, item?.statusName as AvailableApplicationStatus);
        });

        this.contractFinalizationStatus.forEach((item) => {
            this.fetchProjectStatusCount(item.name, item?.statusName as AvailableProjectStatus);
        });

        this.fundReleaseStatus.forEach((item) => {
            this.fetchProjectFundReleaseStatusCount(
                item.name,
                item?.statusName as AvailableProjectStatus,
                item?.includeTranche
            );
        });
    }

    fetchApplicationStatusCount(name: string, statusName?: AvailableApplicationStatus) {
        this.applicationService
            ?.fetchApplicationStatusCount({
                status: statusName,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.applicationStatus = this.applicationStatus.map((item) => {
                            if (item?.name === name) {
                                item.count = data?.count ?? 0;
                            }
                            return item;
                        });
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching application status count for ${statusName}. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const { errorMessage, statusCode } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching application status count for ${statusName}. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    fetchProjectStatusCount(name: string, statusName?: AvailableProjectStatus, includeTranche?: boolean) {
        this.projectService
            ?.fetchProjectStatusCount({
                status: statusName,
                includeTranche,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.contractFinalizationStatus = this.contractFinalizationStatus.map((item) => {
                            if (item?.name === name) {
                                item.count = data?.count ?? 0;
                            }
                            return item;
                        });
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching application status count for ${statusName}. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const { errorMessage, statusCode } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching application status count for ${statusName}. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    fetchProjectFundReleaseStatusCount(name: string, statusName?: AvailableProjectStatus, includeTranche?: boolean) {
        this.projectService
            ?.fetchProjectStatusCount({
                status: statusName,
                includeTranche,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.fundReleaseStatus = this.fundReleaseStatus.map((item) => {
                            if (item?.name === name) {
                                item.count = data?.count ?? 0;
                            }
                            return item;
                        });
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching application status count for ${statusName}. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const { errorMessage, statusCode } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching application status count for ${statusName}. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }
}
