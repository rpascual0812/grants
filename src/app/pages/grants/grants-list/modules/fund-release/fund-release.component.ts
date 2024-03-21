import { Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/directives/ngbd-sortable-header.directive';

interface Grant {
    partnerId: string;
    partner: string;
    title: string;
    applicationDate: Date;
    proposedBudget: number;
    donorProject: string;
    expanded: boolean;
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
export class FundReleaseComponent {
    fundRelease: Grant[] = [];
    closingGrant: Grant[] = [];
    page: number = 1;
    @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective<Grant>>;

    constructor() {
        for (let i = 1; i <= 12; i++) {
            this.fundRelease.push({
                partnerId: `${i}${new Date().getTime()}`,
                title: `Project Proposal Title - ${i}`,
                partner: `Organization Name - ${i}`,
                applicationDate: new Date(`2024-${i}-1`),
                proposedBudget: 100,
                donorProject: `Random Donor Project - ${i}`,
                expanded: false,
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
}
