import { Component, QueryList, ViewChildren } from '@angular/core';
import {
    NgbdSortableHeaderDirective,
    SortEvent,
} from 'src/app/directives/ngbd-sortable-header.directive';

interface Grant {
    partnerId: string;
    partner: string;
    title: string;
    applicationDate: Date;
    proposedBudget: number;
    donorProject: string;
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
export class ContractFinalizationComponent {
    contractPreparation: Grant[] = [];
    finalApproval: Grant[] = [];
    partnerSigning: Grant[] = [];

    page: number = 1;
    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective<Grant>>;

    constructor() {
        for (let i = 1; i <= 12; i++) {
            this.contractPreparation.push({
                partnerId: `${i}${new Date().getTime()}`,
                title: `Project Proposal Title - ${i}`,
                partner: `Organization Name - ${i}`,
                applicationDate: new Date(`2024-${i}-1`),
                proposedBudget: 100,
                donorProject: `Random Donor Project - ${i}`
            });
        }
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
}
