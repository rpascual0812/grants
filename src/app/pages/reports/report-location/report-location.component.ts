import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Province } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { GlobalService } from 'src/app/services/global.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

type ProvinceObj = {
    [key: string]: Province & {
        count: number;
    };
};

type GroupByRegion = {
    [key: string]: {
        regionName: string;
        provinces: string[];
        count: number;
    };
};

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

type CustomLegend = {
    label: string;
    count: number;
    color: string;
};

@Component({
    selector: 'app-report-location',
    templateUrl: './report-location.component.html',
    styleUrls: ['./report-location.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ReportLocationComponent implements OnInit {
    title = 'Location';
    type = ChartType.GeoChart;
    data: Row[] = [];
    customLegends: CustomLegend[] = [];
    colorMapper: Record<string, number> = {};
    columns = ['Location', 'Grants'];
    options = {
        region: 'world',
        colorAxis: {
            minValue: 0,
            maxValue: 1,
            colors: [] as string[],
        },
        tooltip: {
            isHtml: true,
        },
        backgroundColor: '#81d4fa',
        datalessRegionColor: '#f8bbd0',
        defaultColor: '#f5f5f5',
        legend: 'none',
    };

    dateFrom: Date;
    dateTo: Date;
    formattedDateFrom: string | string[];
    formattedDateTo: string | string[];
    countryPk: number | number[];
    countryCode: string;
    provinceObj: ProvinceObj = {};

    loading = true;

    constructor(
        private globalService: GlobalService,
        private projectService: ProjectService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        const filters = {
            country_pk: this.countryPk ?? [],
            date_from: this.formattedDateFrom ?? [],
            date_to: this.formattedDateTo ?? [],
        };
        this.projectService.fetch(filters).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                if (status) {
                    if (typeof this.countryPk === 'number') {
                        this.countryCode = data?.at(0)?.project_location?.at(0)?.country?.code ?? '';
                        this.fetchProvince(String(this.countryPk), data);
                    } else {
                        this.setWorldChart(data);
                        this.loading = false;
                    }
                } else {
                    this.toastr.error(`An error occurred while fetching Projects. Please try again.`, 'ERROR!');
                    this.loading = false;
                }
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

    fetchProvince(countryPk: string, projects: Project[]) {
        this.globalService.selectFetch(`province?country_pk=${countryPk}`).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data as Province[];
                if (status) {
                    if (data?.length > 0) {
                        this.getProvinceObj(data);
                        this.getCountGrantsPerProvinces(projects);
                        this.setProvinceChart();
                    } else {
                        this.setWorldChart(projects);
                    }
                } else {
                    this.toastr.error(`An error occurred while fetching Provinces. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Provinces. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    setChartColumn() {
        this.columns = ['Location', 'colorMapper', 'Grants'];
    }

    getRandomColor(name: string) {
        // Create a hash value from the country name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash = hash & hash;
        }

        // Generate random RGB values based on the hash value
        const red = Math.floor(((hash & 0xff) / 255) * 256);
        const green = Math.floor((((hash >> 8) & 0xff) / 255) * 256);
        const blue = Math.floor((((hash >> 16) & 0xff) / 255) * 256);

        // Convert the RGB values to a hexadecimal color code
        const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue
            .toString(16)
            .padStart(2, '0')}`;

        return color;
    }

    setChartData(project: Project[]) {
        const countryObj = this.getCountGrantsPerCountry(project);
        let tempData: Row[] = [];
        Object.entries(countryObj).forEach(([_key, item], idx) => {
            const colorMapper = idx;
            tempData.push([item.name, colorMapper, item.count]);
        });

        this.colorMapper = {};
        this.data = tempData;
        this.options.colorAxis.colors = [];
        this.options.colorAxis.minValue = 0;

        const maxValue = this.data.length - 1;
        this.options.colorAxis.maxValue = maxValue > 0 ? maxValue : 0;

        this.data.forEach(([key, colorMapper, _count]) => {
            const randomColor = this.getRandomColor(key as string);
            this.options.colorAxis.colors.push(randomColor);
            this.colorMapper[key as string] = colorMapper as number;
        });

        this.data = tempData;
    }

    setChartOption(project: Project[]) {
        if (this.countryPk && !Array.isArray(this.countryPk)) {
            const code = project.at(0)?.project_location?.at(0)?.country?.code;
            this.options.region = code ?? 'world';
        } else {
            this.options.region = 'world';
            (this.options as any).resolution = null;
        }
    }

    setWorldChart(Project: Project[]) {
        if (Project.length > 0) {
            this.setChartColumn();
            this.setChartData(Project);
            this.setChartOption(Project);
            this.setCustomLegends();
        }
    }

    setChartOptionProvinces() {
        this.options.region = this.countryCode;
        (this.options as any).resolution = 'provinces';
    }

    setChartColumnProvinces() {
        this.columns = ['ID', 'Region Name', `colorMapper`, 'Grants'];
    }

    setChartDataProvinces() {
        let tempData: Row[] = [];
        const groupByRegion: GroupByRegion = this.getGroupByRegion();
        Object.entries(groupByRegion).forEach(([key, item], idx) => {
            const count = item?.count;
            const colorMapper = idx;
            const regionName = item?.regionName;
            tempData.push([key, regionName, colorMapper, count]);
        });

        this.colorMapper = {};
        this.data = tempData;
        this.options.colorAxis.colors = [];
        this.options.colorAxis.minValue = 0;

        const maxValue = this.data.length - 1;
        this.options.colorAxis.maxValue = maxValue > 0 ? maxValue : 0;

        this.data.forEach(([_key, name, colorMapper, _count]) => {
            const randomColor = this.getRandomColor(name as string);
            this.options.colorAxis.colors.push(randomColor);
            this.colorMapper[name as string] = colorMapper as number;
        });
    }

    getGroupByRegion() {
        const groupByRegion: GroupByRegion = {};
        Object.entries(this.provinceObj).forEach(([key, item]) => {
            const isoRegion = (item as any)?.iso_code;
            const count = (item as any)?.count;
            const regionName = (item as any)?.region_name;
            const province = (item as any)?.name;
            if (!groupByRegion[isoRegion]) {
                groupByRegion[isoRegion] = {
                    regionName,
                    provinces: [province],
                    count,
                };
            } else {
                groupByRegion[isoRegion].provinces = [...(groupByRegion[isoRegion]?.provinces ?? []), province];
                groupByRegion[isoRegion].count += count;
            }
        });
        return groupByRegion;
    }

    setProvinceChart() {
        this.setChartColumnProvinces();
        this.setChartOptionProvinces();
        this.setChartDataProvinces();
        this.setCustomLegends();
    }

    getProvinceObj(provinces: Province[]) {
        this.provinceObj = {};
        provinces?.forEach((province) => {
            const provinceCodeKey = province?.province_code ?? 'unknown-province';
            if (!this.provinceObj[provinceCodeKey]) {
                this.provinceObj[provinceCodeKey] = {
                    ...province,
                    count: 0,
                };
            }
        });
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

    getCountGrantsPerProvinces(projects: Project[]) {
        projects?.forEach((proj) => {
            const projectLoc = proj?.project_location ?? [];
            projectLoc?.forEach((loc) => {
                const provinceCodeKey = loc?.province_code ?? '';
                if (this.provinceObj[provinceCodeKey]) {
                    this.provinceObj[provinceCodeKey].count += 1;
                }
            });
        });
    }

    setCustomLegends() {
        this.customLegends = [];
        this.data?.forEach((value, idx) => {
            let name = value.at(0) ?? '';
            let count = value.at(2) ?? 0;
            let colorIdx = value.at(1);
            if (this.options.region !== 'world') {
                name = value.at(1) ?? '';
                count = value.at(3) ?? 0;
                colorIdx = value.at(2) ?? '';
            }
            if (typeof name === 'string' && name.trim() !== '' && typeof count === 'number') {
                const colorMapperIdx = this.colorMapper[name];
                this.customLegends.push({
                    label: `${count} - ${name} `,
                    count,
                    color: this.options.colorAxis.colors?.at(colorMapperIdx) as string,
                });
            }
        });
        this.customLegends.sort((a, b) => b.count - a.count);
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
