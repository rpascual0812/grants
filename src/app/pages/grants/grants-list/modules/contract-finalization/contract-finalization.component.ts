import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/directives/ngbd-sortable-header.directive';
import { Application } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';

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
    status: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
    if (v1 instanceof Date && v2 instanceof Date) {
        return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
    }
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

@Component({
    selector: 'app-contract-finalization',
    templateUrl: './contract-finalization.component.html',
    styleUrls: ['./contract-finalization.component.scss'],
})
export class ContractFinalizationComponent implements OnInit {
    loading = false;
    contractPreparation: Grant[] = [];
    finalApproval: Grant[] = [];
    partnerSigning: Grant[] = [];
    donors: number[] = [];
    partnerName: string = '';

    page: number = 1;
    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective<Grant>>;

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        const filters = {
            donors: this.donors,
        };
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
                        status: item?.status ?? '',
                    }));
                    this.contractPreparation = projects.filter((proj) => proj.status == 'Contract Preparation');
                    this.finalApproval = projects.filter((proj) => proj.status == 'Final Approval');
                    this.partnerSigning = projects.filter((proj) => proj.status == 'Partner Signing');
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
            this.contractPreparation = [...this.contractPreparation];
        } else {
            this.contractPreparation = [...this.contractPreparation].sort((a, b) => {
                const res = compare(a[column], b[column]);
                return direction === 'asc' ? res : -res;
            });
        }
    }

    handlePageChange($event: number) {
        this.page = $event;
    }

    setDonors(donors: number[]) {
        this.donors = donors;
        this.fetch();
    }
}
