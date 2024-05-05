import { Component, Input, QueryList, ViewChildren, effect, inject } from '@angular/core';
import { NgbdSortableHeaderDirective, SortEvent } from '../../../directives/ngbd-sortable-header.directive';
import { ApplicationService } from 'src/app/services/application.service';
import { TransformApplicationForList, compare, transformApplicationForList } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from '../../../utilities/globals';
import {
    APPLICATION_REVIEW_LIST_KEY,
    LinkGeneratorSignalService,
} from 'src/app/services/link-generator.signal.service';
import { ApplicationListSignalService } from 'src/app/services/application-list.signal.service';
import { Application } from 'src/app/interfaces/_application.interface';

type TableObj = {
    list: TransformApplicationForList;
    page: number;
    tableSize: number;
};

type GrantApplicationTableObj = {
    proposals: TableObj;
    grantsTeamReview: TableObj;
    advisersReview: TableObj;
    dueDiligence: TableObj;
    budgetReviewAndFinalization: TableObj;
    financialManagementCapacity: TableObj;
};
@Component({
    selector: 'app-applications-list',
    templateUrl: './applications-list.component.html',
    styleUrls: ['./applications-list.component.scss'],
})
export class ApplicationsListComponent {
    @Input() filter: Set<string>;

    isLoading = true;
    tableSizes: any = _.TABLE_SIZES;
    grantApplication: GrantApplicationTableObj = {
        proposals: {
            list: [],
            page: 1,
            tableSize: 10,
        },
        advisersReview: {
            list: [],
            page: 1,
            tableSize: 10,
        },
        grantsTeamReview: {
            list: [],
            page: 1,
            tableSize: 10,
        },
        dueDiligence: {
            list: [],
            page: 1,
            tableSize: 10,
        },
        budgetReviewAndFinalization: {
            list: [],
            page: 1,
            tableSize: 10,
        },
        financialManagementCapacity: {
            list: [],
            page: 1,
            tableSize: 10,
        },
    };

    cp: { [id: string]: number } = {};

    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<
        NgbdSortableHeaderDirective<TransformApplicationForList>
    >;

    linkGeneratorSignalService = inject(LinkGeneratorSignalService);
    appListSignalService = inject(ApplicationListSignalService);

    constructor(private applicationService: ApplicationService, private toastr: ToastrService) {}

    generatorSignalEffect = effect(() => {
        const data = this.linkGeneratorSignalService.linkGeneratorData();
        if (data?.refetchKey === APPLICATION_REVIEW_LIST_KEY) {
            this.handleFetchApplication();
        }
    });

    appListSignalEffect = effect(
        () => {
            const filters = this.appListSignalService.filters();
            const applyFilters = this.appListSignalService.applyFilter();
            if (applyFilters) {
                this.handleFetchApplication(filters ?? undefined);
                this.appListSignalService.applyFilter.set(false);
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.handleFetchApplication();
    }

    handleFetchApplication(filters?: { type_pk?: number }) {
        this.isLoading = true;
        this.applicationService
            .fetch({
                ...filters,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data ?? [];
                    console.log('all', data);

                    const received_proposals = data.filter((d: any) => d.status == 'Received Proposals');
                    const grants_team_review = data.filter((d: any) => d.status == 'Grants Team Review');
                    const advisers_review = data.filter((d: any) => d.status == 'Advisers Review');
                    const due_diligence = data.filter((d: any) => d.status == 'Due Diligence Final Review');
                    const budget_review = data.filter((d: any) => d.status == 'Budget Review and Finalization');
                    const financial_management_capacity = data.filter(
                        (d: any) => d.status == 'Financial Management Capacity'
                    );

                    this.grantApplication.proposals.list = transformApplicationForList(
                        received_proposals as Application[]
                    );
                    this.grantApplication.grantsTeamReview.list = transformApplicationForList(
                        grants_team_review as Application[]
                    );
                    this.grantApplication.advisersReview.list = transformApplicationForList(
                        advisers_review as Application[]
                    );
                    this.grantApplication.dueDiligence.list = transformApplicationForList(
                        due_diligence as Application[]
                    );

                    this.grantApplication.budgetReviewAndFinalization.list = transformApplicationForList(
                        budget_review as Application[]
                    );
                    this.grantApplication.financialManagementCapacity.list = transformApplicationForList(
                        financial_management_capacity as Application[]
                    );
                    this.isLoading = false;
                    this.linkGeneratorSignalService.linkGeneratorData.set(null);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.linkGeneratorSignalService.linkGeneratorData.set(null);
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
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this application?</strong>',
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
                this.applicationService.destroy(application.applicationPk).subscribe({
                    next: (data: any) => {
                        const status = data?.status;
                        if (status) {
                            this.grantApplication.proposals.list = this.grantApplication.proposals.list.filter(
                                (item) => item.applicationPk !== application.applicationPk
                            );
                            this.grantApplication.grantsTeamReview.list =
                                this.grantApplication.grantsTeamReview.list.filter(
                                    (item) => item.applicationPk !== application.applicationPk
                                );
                            this.grantApplication.advisersReview.list =
                                this.grantApplication.advisersReview.list.filter(
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
        );
    }

    onTableSizeChange(event: any, key: keyof typeof this.grantApplication) {
        this.grantApplication[key].tableSize = event.target.value;
        this.grantApplication[key].page = 1;
        this.handleFetchApplication();
    }
}
