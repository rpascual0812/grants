import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectFunding, ProjectFundingReport } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../utilities/globals';
import { DateTime } from 'luxon';

const INTERIM_NARRATIVE_REPORT = 'interim narrative report';
const INTERIM_FINANCIAL_REPORT = 'interim financial report';
const APPROVED_STATUS = 'approved';

interface OverdueTranche extends ProjectFunding {
    project: Project;
    project_funding_report: ProjectFundingReport[];
}

@Component({
    selector: 'app-overdue-reports',
    templateUrl: './overdue-reports.component.html',
    styleUrls: ['./overdue-reports.component.scss'],
})
export class OverdueReportsComponent implements OnInit {
    loading = false;
    overdueReports: OverdueTranche[] = [];

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
                    this.overdueReports = data ?? [];
                    this.overdueReports = this.overdueReports
                        ?.filter((item) => {
                            const reportDueDate = DateTime.fromJSDate(new Date(item?.report_due_date ?? ''));
                            const currentDate = DateTime.fromJSDate(new Date());
                            return currentDate >= reportDueDate;
                        })
                        ?.filter((item) => {
                            const existingApprovedNarrativeReport = item?.project_funding_report?.filter(
                                (report) =>
                                    report?.title === INTERIM_NARRATIVE_REPORT && report?.status !== APPROVED_STATUS
                            );
                            const existingApprovedFinancial = item?.project_funding_report?.filter(
                                (report) =>
                                    report?.title === INTERIM_FINANCIAL_REPORT && report?.status !== APPROVED_STATUS
                            );
                            return (
                                existingApprovedFinancial?.length !== 0 || existingApprovedNarrativeReport?.length !== 0
                            );
                        });
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
