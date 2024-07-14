import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/directives/ngbd-sortable-header.directive';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { AVAILABLE_PROJECT_STATUS_OBJ, getOtherCurrencyKey } from 'src/app/utilities/constants';
import { Project } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { SummaryService } from '../summary/summary.service';

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

export type SearchQuery = {
    partnerName?: string;
    countryPk?: number;
    provinceCode?: number;
    projectTitle?: string;
    typePk?: number;
};

export type KeySearchQuery = keyof SearchQuery;

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
    searchQuery: SearchQuery = {
        partnerName: undefined,
        countryPk: undefined,
        provinceCode: undefined,
        projectTitle: undefined,
        typePk: undefined,
    };

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
        private summaryService: SummaryService
    ) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        const { partnerName, countryPk, provinceCode, projectTitle, typePk } = this.searchQuery;
        const filters = {
            donors: this.donors,
            partner_name: partnerName?.trim() === '' || !partnerName ? [] : partnerName,
            country_pk: countryPk ?? [],
            province_code: provinceCode ?? [],
            title: projectTitle?.trim() === '' || !projectTitle ? [] : projectTitle,
            type_pk: typePk ?? [],
        };
        this.loading = true;
        this.summaryService.currentProjectList.next({
            projects: [],
            loading: true,
        });
        this.projectService.fetch(filters).subscribe({
            next: (res: any) => {
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
                            getOtherCurrencyKey(item?.project_proposal?.budget_request_other_currency ?? '') ?? '',
                        donorProject: '',
                        expanded: false,
                        status: item.status ?? '',
                    }));
                    this.fundRelease = projects.filter(
                        (proj) => proj.status === AVAILABLE_PROJECT_STATUS_OBJ.fundRelease
                    );
                    this.closingGrant = projects.filter(
                        (proj) => proj.status === AVAILABLE_PROJECT_STATUS_OBJ.completed
                    );
                    this.setSummaryProjectList(data ?? []);
                } else {
                    this.setSummaryProjectListLoading(false);
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
                this.setSummaryProjectListLoading(false);
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

    setSearchQuery(searchQuery: SearchQuery) {
        this.searchQuery = searchQuery;
        this.fetch();
    }

    setSummaryProjectList(data: Project[]) {
        const fundRelease = data.filter((proj) => proj.status === AVAILABLE_PROJECT_STATUS_OBJ.fundRelease);
        const closingGrant = data.filter((proj) => proj.status === AVAILABLE_PROJECT_STATUS_OBJ.completed);
        const projList = [...fundRelease, ...closingGrant] ?? [];
        this.summaryService.currentProjectList.next({
            projects: projList,
            loading: false,
        });
    }

    setSummaryProjectListLoading(loading: boolean) {
        this.summaryService.currentProjectList.next({
            loading,
        });
    }
}
