import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { AvailableApplicationStatus } from 'src/app/utilities/constants';

export interface ApplicationData extends Application {
    days_since_received?: number;
}

type ApplicationItem = {
    title: string;
    headerBg: string;
    dataLimited: Application[];
    dataFull: Application[];
    status?: AvailableApplicationStatus;
    offSet: number;
    maxCount: number;
    isLoading?: boolean;
};

@Component({
    selector: 'app-application-list',
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
    applications: ApplicationItem[] = [
        {
            title: 'Submission',
            headerBg: '#da6800',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Received Proposals',
            headerBg: '#f44335',
            status: 'Received Proposals',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Grants Team Review',
            headerBg: '#f24700',
            status: 'Grants Team Review',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Advisers Review',
            headerBg: '#ff6200',
            status: 'Advisers Review',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Budget Review and Finalization',
            headerBg: '#ff9100',
            status: 'Budget Review and Finalization',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Financial Management Capacity',
            headerBg: '#ff9100',
            status: 'Financial Management Capacity',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
        {
            title: 'Due Diligence (Medium Grants)',
            headerBg: '#ff6200',
            status: 'Due Diligence Final Review',
            dataLimited: [],
            dataFull: [],
            offSet: 5,
            maxCount: 0,
            isLoading: true,
        },
    ];

    constructor(private applicationService: ApplicationService, private toastr: ToastrService) {}

    ngOnInit() {
        this.applications.forEach((item) => {
            this.fetch(item.title, {
                ...(item?.status && { status: item?.status }),
            });
        });
    }

    fetch(title: string, filters?: { status?: AvailableApplicationStatus; limit?: number }) {
        this.applicationService.fetch(filters).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.applications = this.applications.map((item) => {
                        if (item.title === title) {
                            const cleansedData = ((data as Application[]) ?? [])
                                .filter(
                                    (itemData) => itemData?.project?.title && itemData?.project?.title?.trim() !== ''
                                )
                                .filter((itemData) => itemData?.date_submitted);
                            item.dataFull = cleansedData;
                            item.dataLimited = [...cleansedData].splice(0, item?.offSet);
                            item.maxCount = item?.dataFull?.length;
                        }
                        item.isLoading = false;
                        return item;
                    });
                } else {
                    this.toastr.error(
                        `An error occurred while fetching application for ${filters?.status ?? ''}. Please try again.`,
                        'ERROR!'
                    );
                }
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching application for ${
                        filters?.status ?? ''
                    }. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    getDaysSinceReceived(dateSubmitted?: Date) {
        if (!dateSubmitted) {
            return '';
        }

        const currentDate = DateTime.fromJSDate(new Date());
        const parsedDateSubmitted = DateTime.fromJSDate(new Date(dateSubmitted));
        const diff = currentDate.diff(parsedDateSubmitted, 'days');
        const day = Math.ceil(diff.as('days'));
        return day;
    }

    handleOnSeeMore(applicationsIdx: number) {
        const target = this.applications.at(applicationsIdx);
        if (target) {
            target.offSet += 5;
            target.dataLimited = [...target?.dataFull]?.splice(0, target?.offSet);
        }
    }
}
