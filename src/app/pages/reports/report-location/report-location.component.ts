import { Component, OnInit } from '@angular/core';
import { ChartType, GoogleChartComponent, Row } from 'angular-google-charts';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

type SelectItem = {
    pk?: number;
    name: string;
};

type CountryMapperObj = {
    pk: number;
    code: string;
    name: string;
    count: number;
};

@Component({
    selector: 'app-report-location',
    templateUrl: './report-location.component.html',
    styleUrls: ['./report-location.component.scss'],
})
export class ReportLocationComponent implements OnInit {
    title = 'Location';
    type = 'GeoChart' as ChartType;
    data: Row[] = [];

    columns = ['Country', 'Grants'];
    options = {
        region: 'world',
        legend: 'none',
        colorAxis: { colors: ['#0070C0', '#FFFF00', '#A65628'] },
        backgroundColor: 'white',
        datalessRegionColor: '#f8bbd0',
        defaultColor: '#f5f5f5',
    };

    dateFrom: Date;
    dateTo: Date;
    formattedDateFrom: string | string[];
    formattedDateTo: string | string[];
    countryPk: number | number[];

    loading = true;
    constructor(private projectService: ProjectService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        const filters = {
            country_pk: this.countryPk ?? [],
            date_from: this.formattedDateFrom ?? [],
            date_to: this.formattedDateTo ?? [],
        };

        this.loading = true;
        this.projectService.fetch(filters).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                if (status) {
                    this.setChartData(data);
                    this.setChartOption(data);
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Projects. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    setChartData(project: Project[]) {
        const countryObj = this.getCountGrantsPerCountry(project);
        let tempData: Row[] = [];
        Object.entries(countryObj).forEach(([key, item]) => {
            tempData.push([item.name, item.count]);
        });
        this.data = tempData;
    }

    setChartOption(project: Project[]) {
        if (this.countryPk && !Array.isArray(this.countryPk)) {
            const code = project.at(0)?.project_location?.at(0)?.country?.code;
            this.options.region = code ?? 'world';
        } else {
            this.options.region = 'world';
        }
    }

    getCountGrantsPerCountry(projects: Project[]) {
        const countGrantsPerCountry: Record<string, CountryMapperObj> = {};
        projects?.forEach((proj) => {
            const projectLoc = proj?.project_location ?? [];
            projectLoc?.forEach((loc) => {
                const countryPk = loc?.country_pk;
                if (countryPk) {
                    if (!countGrantsPerCountry[countryPk]) {
                        countGrantsPerCountry[countryPk] = {
                            pk: countryPk,
                            code: loc?.country?.code ?? '',
                            name: loc?.country?.name ?? '',
                            count: 1,
                        };
                    } else {
                        countGrantsPerCountry[countryPk].count += 1;
                    }
                }
            });
        });
        return countGrantsPerCountry;
    }

    handleOnApply() {
        this.formattedDateFrom = this.formatDate(this.dateFrom);
        this.formattedDateTo = this.formatDate(this.dateTo);
        this.fetch();
    }

    formatDate(date: Date) {
        const isValid = DateTime.fromJSDate(date).isValid;
        if (isValid) {
            return DateTime.fromJSDate(date).toFormat('yyyy-MM');
        }
        return [];
    }

    onSelect(item: SelectItem[]) {
        this.countryPk = item?.at(0)?.pk ?? [];
    }
}
