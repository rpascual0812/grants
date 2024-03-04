import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeaderDirective, SortEvent } from '../../directives/ngbd-sortable-header.directive';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { TransformApplicationForList, compare, transformApplicationForList } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

type TableObj = {
    list: TransformApplicationForList;
    page: number;
};

type GrantApplicationTableObj = {
    urgentGrants: TableObj;
    submissions: TableObj;
    advisersReview: TableObj;
    grantsTeamReview: TableObj;
    dueDiligence: TableObj;
    budgetReviewAndFinalization: TableObj;
    financialManagementCapacity: TableObj;
};

@Component({
    selector: 'app-grant-application',
    templateUrl: './grant-application.component.html',
    styleUrls: ['./grant-application.component.scss'],
})
export class GrantApplicationComponent implements OnInit {
    isLoading = true;
    grantApplication: GrantApplicationTableObj = {
        urgentGrants: {
            list: [],
            page: 1,
        },
        submissions: {
            list: [],
            page: 1,
        },
        advisersReview: {
            list: [],
            page: 1,
        },
        grantsTeamReview: {
            list: [],
            page: 1,
        },
        dueDiligence: {
            list: [],
            page: 1,
        },
        budgetReviewAndFinalization: {
            list: [],
            page: 1,
        },
        financialManagementCapacity: {
            list: [],
            page: 1,
        },
    };

    cp: { [id: string]: number } = {};

    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<
        NgbdSortableHeaderDirective<TransformApplicationForList>
    >;

    constructor(private applicationService: ApplicationService, private toastr: ToastrService) {}

    ngOnInit() {
        this.handleFetchApplication();
    }

    handleFetchApplication() {
        this.isLoading = true;
        this.applicationService.fetch().subscribe({
            next: (res: any) => {
                const data = res?.data ?? [];
                this.grantApplication.urgentGrants.list = transformApplicationForList(data as ApplicationRead[]);
                this.grantApplication.submissions.list = transformApplicationForList(data as ApplicationRead[]);
                this.grantApplication.grantsTeamReview.list = transformApplicationForList(data as ApplicationRead[]);
                this.grantApplication.advisersReview.list = transformApplicationForList(data as ApplicationRead[]);
                this.grantApplication.dueDiligence.list = transformApplicationForList(data as ApplicationRead[]);

                this.grantApplication.budgetReviewAndFinalization.list = transformApplicationForList(
                    data as ApplicationRead[]
                );
                this.grantApplication.financialManagementCapacity.list = transformApplicationForList(
                    data as ApplicationRead[]
                );
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            },
        });
    }

    onSort({ column, direction }: SortEvent<TransformApplicationForList[0]>, key: keyof GrantApplicationTableObj) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        // sorting values
        if (direction === '' || column === '') {
            this.grantApplication[key].list = [...this.grantApplication[key].list];
        } else {
            this.grantApplication[key].list = [...this.grantApplication[key].list].sort((a, b) => {
                const res = compare(a[column], b[column]);
                return direction === 'asc' ? res : -res;
            });
        }
    }

    remove(application: TransformApplicationForList[0]) {
        this.applicationService.destroy(application.applicationPk).subscribe({
            next: (data: any) => {
                const status = data?.status;
                if (status) {
                    this.grantApplication.urgentGrants.list = this.grantApplication.urgentGrants.list.filter(
                        (item) => item.applicationPk !== application.applicationPk
                    );
                    this.grantApplication.submissions.list = this.grantApplication.submissions.list.filter(
                        (item) => item.applicationPk !== application.applicationPk
                    );
                    this.grantApplication.grantsTeamReview.list = this.grantApplication.grantsTeamReview.list.filter(
                        (item) => item.applicationPk !== application.applicationPk
                    );
                    this.grantApplication.advisersReview.list = this.grantApplication.advisersReview.list.filter(
                        (item) => item.applicationPk !== application.applicationPk
                    );
                    this.grantApplication.dueDiligence.list = this.grantApplication.dueDiligence.list.filter(
                        (item) => item.applicationPk !== application.applicationPk
                    );
                    this.grantApplication.budgetReviewAndFinalization.list =
                        this.grantApplication.budgetReviewAndFinalization.list.filter(
                            (item) => item.applicationPk !== application.applicationPk
                        );
                    this.grantApplication.financialManagementCapacity.list =
                        this.grantApplication.financialManagementCapacity.list.filter(
                            (item) => item.applicationPk !== application.applicationPk
                        );
                }
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }
}
