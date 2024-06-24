import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectFunding } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../utilities/globals';

interface OverdueReport extends Project {
    project_funding: ProjectFunding[];
}

@Component({
    selector: 'app-overdue-reports',
    templateUrl: './overdue-reports.component.html',
    styleUrls: ['./overdue-reports.component.scss'],
})
export class OverdueReportsComponent implements OnInit {
    loading = false;
    overdueReports: OverdueReport[] = [];

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.projectService.fetchOverdueReports().subscribe({
            next: (res: any) => {
                const data = res?.data;
                const status = res?.status;
                if (status) {
                    this.overdueReports = data ?? [];
                    this.overdueReports = this.overdueReports?.filter((item) => item?.project_funding?.length > 0)
                } else {
                    this.toastr.error(`An error occurred while fetching Overdue Reports. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Overdue Reports. ${statusCode} ${errorMessage} Please try again.`,
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
