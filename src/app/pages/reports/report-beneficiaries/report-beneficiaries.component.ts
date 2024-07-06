import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-report-beneficiaries',
    templateUrl: './report-beneficiaries.component.html',
    styleUrls: ['./report-beneficiaries.component.scss']
})
export class ReportBeneficiariesComponent implements OnInit {
    months: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
    years: number[] = [];

    dates: any = {
        from: {
            month: '',
            year: ''
        },
        to: {
            month: '',
            year: ''
        }
    }

    filters: any = [
        {
            name: 'Male',
            dates: {}
        },
        {
            name: 'Female',
            dates: {}
        }
    ];

    dateRange: number[] = [];
    totals: any = {
        'Male': 0,
        'Female': 0,
        'Men Youth': 0,
        'Women Youth': 0,
        'Indigenous People': 0,
        'Non-IP': 0,
        'Diffables': 0
    };
    project_pk: number | null = null;

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
    ) {

    }

    ngOnInit() {
        let yearNow = parseInt(DateTime.now().toFormat('yyyy'));

        for (let i = 2000; i <= yearNow; i++) {
            this.years.push(i);
        }

        this.dates.from.year = yearNow;
        this.dates.to.year = yearNow;

        this.dates.from.month = DateTime.now().toFormat('MMMM');
        this.dates.to.month = DateTime.now().toFormat('MMMM');

        this.updateDates();
        this.resetTotals();
    }

    search() {
        this.fetch();
    }

    updateDates() {
        this.dateRange = [];
        for (let i = this.dates.from.year; i <= this.dates.to.year; i++) {
            this.dateRange.push(i);
        }

        this.resetFilters();
        this.fetch();
    }

    onChangeSelectedItem(ev: any) {
        this.project_pk = ev.length > 0 ? ev[0].pk : null;
        this.fetch();
    }

    updateFilters(filter: string) {
        const exists = this.filters.filter((_filter: any) => _filter.name == filter);
        if (exists.length > 0) {
            this.filters = this.filters.filter((_filter: any) => _filter.name !== filter);
        }
        else {
            this.filters.push({
                name: filter,
                dates: {}
            });
        }

        this.resetFilters();
        this.fetch();
    }

    resetFilters() {
        this.filters.forEach((filter: any) => {
            let dates: any = {};
            this.dateRange.forEach((date: any) => {
                dates[date] = 0;
            });

            filter.dates = dates;
        });
    }

    fetch() {
        this.resetFilters();
        const params = {
            date_from: this.dates.from.year + "-" + DateTime.fromFormat(this.dates.from.month, 'MMMM').toFormat('MM'),
            date_to: this.dates.to.year + "-" + DateTime.fromFormat(this.dates.to.month, 'MMMM').toFormat('MM'),
            project_pk: this.project_pk
        };

        this.projectService
            .fetchReportProjects(params)
            .subscribe({
                next: (data: any) => {
                    this.resetTotals();
                    const projects: any = data.data;
                    if (projects) {
                        projects.forEach((project: any) => {
                            const date_created = DateTime.fromISO(project.date_created).toFormat('yyyy');
                            if (project.project_beneficiary) {
                                project.project_beneficiary.forEach((beneficiary: any) => {
                                    this.filters.forEach((filter: any) => {
                                        switch (filter.name) {
                                            case 'Male':
                                                filter.dates[date_created] += beneficiary.men_count;
                                                this.totals[filter.name] += beneficiary.men_count;
                                                break;
                                            case 'Female':
                                                filter.dates[date_created] += beneficiary.women_count;
                                                this.totals[filter.name] += beneficiary.women_count;
                                                break;
                                            case 'Men Youth':
                                                filter.dates[date_created] += beneficiary.young_men_count;
                                                this.totals[filter.name] += beneficiary.young_men_count;
                                                break;
                                            case 'Women Youth':
                                                filter.dates[date_created] += beneficiary.young_women_count;
                                                this.totals[filter.name] += beneficiary.young_women_count;
                                                break;
                                            case 'Indigenous People':
                                                filter.dates[date_created] += 0;
                                                this.totals[filter.name] += 0;
                                                break;
                                            case 'Non-IP':
                                                filter.dates[date_created] += 0;
                                                this.totals[filter.name] += 0;
                                                break;
                                            case 'Diffables':
                                                filter.dates[date_created] += beneficiary.women_diffable_count + beneficiary.young_women_diffable_count + beneficiary.men_diffable_count + beneficiary.young_men_diffable_count;
                                                this.totals[filter.name] += beneficiary.women_diffable_count + beneficiary.young_women_diffable_count + beneficiary.men_diffable_count + beneficiary.young_men_diffable_count;
                                                break;

                                            default:
                                                break;
                                        }
                                    });
                                });
                            }
                        });
                    }
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    resetTotals() {
        this.totals = {
            'Male': 0,
            'Female': 0,
            'Men Youth': 0,
            'Women Youth': 0,
            'Indigenous People': 0,
            'Non-IP': 0,
            'Diffables': 0
        };
    }
}
