import { ApplicationService } from 'src/app/services/application.service';
import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/directives/ngbd-sortable-header.directive';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { Application } from 'src/app/interfaces/_application.interface';
import { ToastrService } from 'ngx-toastr';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { Project } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';

interface Grant {
    pk: number;
    partnerId: string;
    partner: string;
    title: string;
    applicationDate: Date;
    proposedBudget: number;
    proposedBudgetOther: number;
    proposedBudgetOtherCurrency: string;
    donorProject: string;
    expanded: boolean;
    status: string;
}

type ColumnObj = string | number | Date;

const compare = (v1: ColumnObj, v2: ColumnObj) => {
    if (v1 instanceof Date && v2 instanceof Date) {
        return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
    }
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

@Component({
    selector: 'app-fund-release',
    templateUrl: './fund-release.component.html',
    styleUrls: ['./fund-release.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FundReleaseComponent implements OnInit {
    loading = false;
    fundRelease: Grant[] = [];
    closingGrant: Grant[] = [];
    page: number = 1;
    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective<Grant>>;
    donors: any = [];

    constructor(private projectService: ProjectService, private toastr: ToastrService) { }

    ngOnInit() {
        this.fetch()
    }

    fetch() {
        this.loading = true;
        this.projectService.fetch({}).subscribe({
            next: (res: any) => {
                console.log(res);
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                if (status) {
                    const projects: Grant[] = data?.map((item) => ({
                        pk: item?.pk as number,
                        partnerId: item?.partner?.partner_id ?? '',
                        partner: item?.partner?.name ?? '',
                        title: item?.title ?? '',
                        applicationDate: item?.date_created as Date,
                        proposedBudget: parseInt(item?.project_proposal?.budget_request_usd ?? ''),
                        proposedBudgetOther: parseInt(item?.project_proposal?.budget_request_other ?? ''),
                        proposedBudgetOtherCurrency:
                            getOtherCurrencyKey(item?.project_proposal?.budget_request_other_currency ?? '') ??
                            '',
                        donorProject: '',
                        expanded: false,
                        status: item.status ?? ''
                    }));
                    this.fundRelease = projects.filter(proj => proj.status == 'Fund Release');
                    this.closingGrant = projects.filter(proj => proj.status == 'Completed');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    onSort({ column, direction }: SortEvent<Grant>) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        // sorting values
        if (direction === '' || column === '') {
            this.fundRelease = [...this.fundRelease];
        } else {
            this.fundRelease = [...this.fundRelease].sort((a, b) => {
                if (typeof a[column] !== 'boolean' && typeof b[column] !== 'boolean') {
                    const res = compare(a[column] as ColumnObj, b[column] as ColumnObj);
                    return direction === 'asc' ? res : -res;
                }
                return 1;
            });
        }
    }

    handlePageChange($event: number) {
        this.page = $event;
    }

    handleReview($event: MouseEvent) {
        $event.stopPropagation();
    }

    handleDelete($event: MouseEvent) {
        $event.stopPropagation();
    }

    handleIsOpenChange($event: boolean, partnerId: string) {
        const currentIdx = this.fundRelease.findIndex((item) => item.partnerId === partnerId);
        this.fundRelease[currentIdx]['expanded'] = $event;
    }

    setDonors(donors: any) {
        this.donors = donors;

        this.fetch();
    }
}
