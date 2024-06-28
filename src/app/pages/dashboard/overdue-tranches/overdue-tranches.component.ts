import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectFunding } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../utilities/globals';
import { DateTime } from 'luxon';

interface OverdueTranche extends ProjectFunding {
    project: Project;
}

@Component({
    selector: 'app-overdue-tranches',
    templateUrl: './overdue-tranches.component.html',
    styleUrls: ['./overdue-tranches.component.scss'],
})
export class OverdueTranchesComponent implements OnInit {
    loading = false;
    overdueTranches: OverdueTranche[] = [];

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.projectService.fetchOverdueTranches().subscribe({
            next: (res: any) => {
                const data = res?.data as OverdueTranche[];
                const status = res?.status;
                if (status) {
                    this.overdueTranches = (data ?? [])
                        ?.filter((item) => {
                            const currentDate = DateTime.fromJSDate(new Date());
                            const releasedDate = DateTime.fromJSDate(new Date(item?.released_date ?? ''));
                            return !item?.bank_receipt_pk || currentDate >= releasedDate;
                        })
                        ?.sort((itemA, itemB) => {
                            return (
                                new Date(itemA?.released_date ?? '').getTime() -
                                new Date(itemB?.released_date ?? '').getTime()
                            );
                        });
                } else {
                    this.toastr.error(`An error occurred while fetching Overdue Tranches. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Overdue Tranches. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    onTableDataChange(event: any) {
        this.pagination.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.pagination.tableSize = event.target.value;
        this.pagination.page = 1;
        this.fetch();
    }
}
