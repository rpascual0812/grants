import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Application, Country, Province } from 'src/app/interfaces/_application.interface';
import { GlobalService } from 'src/app/services/global.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent implements OnInit {
    @Input() application: Application | null = null;
    loadingCountryFetch = true;
    loadingProvinceFetch = true;
    countries: Country[] = [];
    provinces: Province[] = [];

    constructor(private globalService: GlobalService, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetchCountry();
        this.fetchProvince();
    }

    fetchCountry() {
        this.loadingCountryFetch = true;
        this.globalService.selectFetch(`country`).subscribe({
            next: (res: any) => {
                const data = res?.data as Country[];
                const status = res?.status;
                if (status) {
                    this.countries = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Country. Please try again.`, 'ERROR!');
                }
                this.loadingCountryFetch = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loadingCountryFetch = false;
            },
        });
    }

    fetchProvince() {
        this.loadingProvinceFetch = true;
        this.globalService.selectFetch(`province`).subscribe({
            next: (res: any) => {
                const data = res?.data as Province[];
                const status = res?.status;
                if (status) {
                    this.provinces = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Province. Please try again.`, 'ERROR!');
                }
                this.loadingProvinceFetch = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loadingProvinceFetch = false;
            },
        });
    }

    getCountryInfo(countryPk?: number) {
        return this.countries?.find((country) => country?.pk === countryPk);
    }

    getProvinceInfo(provinceCode?: number) {
        return this.provinces?.find((province) => province?.province_code === provinceCode);
    }
}
