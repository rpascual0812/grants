import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectFunding } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../utilities/globals';
import { DateTime } from 'luxon';

interface AgingProject extends Project {
    due_date?: Date;
    lapsed_since_due?: string;
}

interface Tranche extends ProjectFunding {
    project: Project;
    lapsed_since_due?: string;
}

const getDueDate = (duration: string, dateCreated?: Date) => {
    const numberOfMonth = duration?.split(' ')?.at(0);
    if (dateCreated && numberOfMonth) {
        return DateTime.fromJSDate(new Date(dateCreated))
            .plus({ month: Number(numberOfMonth) })
            .toJSDate();
    }
    return;
};

@Component({
    selector: 'app-aging-projects-tranches',
    templateUrl: './aging-projects-tranches.component.html',
    styleUrls: ['./aging-projects-tranches.component.scss'],
})
export class AgingProjectsTranchesComponent implements OnInit {
    loading = {
        agingProjects: false,
        tranches: false,
    };

    filterOption = {
        selected: '',
        options: ['Days', 'Weeks', 'Months'],
    };

    filterValue: any = {
        selected: '',
        options: [],
    };

    agingProjects: AgingProject[] = [];
    tranches: Tranche[] = [];

    agingPagination: any = _.PAGINATION;
    agingTableSizes: any = _.TABLE_SIZES;

    tranchesPagination: any = _.PAGINATION;
    tranchesTableSizes: any = _.TABLE_SIZES;

    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetchProjects();
        this.fetchTranches();
    }

    fetchProjects() {
        this.loading.agingProjects = true;
        this.projectService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as AgingProject[];

                if (status) {
                    this.agingProjects = data
                        ?.filter((item) => {
                            const dueDate = getDueDate(item?.duration ?? '', item?.date_created);
                            const currentDate = DateTime.fromJSDate(new Date());
                            const parsedDate = DateTime.fromJSDate(dueDate as Date);
                            return parsedDate <= currentDate;
                        })
                        ?.map((item) => {
                            const dueDate = getDueDate(item?.duration ?? '', item?.date_created);
                            const currentDate = DateTime.fromJSDate(new Date());
                            let parsedDate = undefined;
                            if (dueDate) {
                                parsedDate = DateTime.fromJSDate(dueDate);
                            }
                            const diff = parsedDate && currentDate.diff(parsedDate, ['day', 'week', 'month']);
                            const lapsedSinceDue =
                                diff && `${Math.floor(diff?.days)} d ${diff?.weeks} w ${diff?.months} m`;
                            return {
                                ...item,
                                due_date: dueDate,
                                lapsed_since_due: lapsedSinceDue,
                            };
                        });
                    this.filterAgingProjects();
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                }
                this.loading.agingProjects = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading.agingProjects = false;
            },
        });
    }

    fetchTranches() {
        this.loading.tranches = true;
        this.projectService.fetchTranches().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Tranche[];
                if (status) {
                    this.tranches = data
                        ?.filter((item) => {
                            const currentDate = DateTime.fromJSDate(new Date());
                            const reportDueDate = DateTime.fromJSDate(new Date(item.report_due_date as Date));
                            return reportDueDate <= currentDate;
                        })
                        ?.map((item) => {
                            const reportDueDate = DateTime.fromJSDate(new Date(item.report_due_date as Date));
                            const currentDate = DateTime.fromJSDate(new Date());
                            const diff = currentDate.diff(reportDueDate, ['days', 'weeks', 'months']);
                            const lapsedSinceDue =
                                diff && `${Math.floor(diff?.days)} d ${diff?.weeks} w ${diff?.months} m`;
                            return {
                                ...item,
                                lapsed_since_due: lapsedSinceDue,
                            };
                        });
                    this.filterTranches();
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                }

                this.loading.tranches = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading.tranches = false;
            },
        });
    }

    filterAgingProjects() {
        const key = this.filterOption?.selected.toLowerCase();
        const value = this.filterValue?.selected;
        if (key.trim() !== '' && value.trim() !== '') {
            this.agingProjects = this.agingProjects.filter((item) => {
                const filterDateOption = DateTime.fromJSDate(new Date()).minus({ [key]: value });
                const dueDate = DateTime.fromJSDate(new Date(item.due_date as Date));
                return filterDateOption >= dueDate;
            });
        }
    }

    filterTranches() {
        const key = this.filterOption?.selected.toLowerCase();
        const value = this.filterValue?.selected;
        if (key.trim() !== '' && value.trim() !== '') {
            this.tranches = this.tranches.filter((item) => {
                const filterDateOption = DateTime.fromJSDate(new Date()).minus({ [key]: value });
                const dueDate = DateTime.fromJSDate(new Date(item.report_due_date as Date));
                return filterDateOption >= dueDate;
            });
        }
    }

    handleOnChangeFilterValue(event: any) {
        const value = event?.target?.value;
        this.filterValue.selected = value;

        this.agingPagination.page = 1;

        this.fetchProjects();
        this.fetchTranches();
    }

    handleOnChangeFilterOption(event: any) {
        const value = event?.target?.value;
        this.filterOption.selected = value;
        if (value.trim() === '') {
            this.filterValue.options = [];
            this.filterValue.selected = '';
            this.fetchProjects();
            this.fetchTranches();
        }

        if (value === this.filterOption.options.at(0)) {
            this.filterValue.options = [];
            this.filterValue.selected = '';
            const MIN_DAY = 1;
            const MAX_DAY = 31;
            for (let day = MIN_DAY; day <= MAX_DAY; day++) {
                this.filterValue.options.push(day);
            }
        }

        if (value === this.filterOption.options.at(1)) {
            this.filterValue.options = [];
            this.filterValue.selected = '';
            const MIN_WEEK = 1;
            const MAX_WEEK = 4;
            for (let week = MIN_WEEK; week <= MAX_WEEK; week++) {
                this.filterValue.options.push(week);
            }
        }

        if (value === this.filterOption.options.at(2)) {
            this.filterValue.options = [];
            this.filterValue.selected = '';
            const MIN_MONTH = 1;
            const MAX_MONTH = 12;
            for (let month = MIN_MONTH; month <= MAX_MONTH; month++) {
                this.filterValue.options.push(month);
            }
        }
    }

    onTableDataChange(event: any, key: string) {
        if (key === 'agingProjects') {
            this.agingPagination.page = event;
            this.fetchProjects();
        }

        if (key === 'tranches') {
            this.tranchesPagination.page = event;
            this.fetchTranches();
        }
    }

    onTableSizeChange(event: any, key: string): void {
        if (key === 'agingProjects') {
            this.agingPagination.tableSize = event.target.value;
            this.agingPagination.page = 1;
            this.fetchProjects();
        }

        if (key === 'tranches') {
            this.tranchesPagination.tableSize = event.target.value;
            this.tranchesPagination.page = 1;
            this.fetchTranches();
        }
    }
}
