import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-grant-information',
    templateUrl: './grant-information.component.html',
    styleUrls: ['./grant-information.component.scss']
})
export class GrantInformationComponent implements OnInit {
    @Input() project: any;
    countries: any = [];
    donors: any = [];

    ngOnInit(): void {
        this.project.project_location.forEach((location: any) => {
            if (!this.countries.includes(location?.country?.name)) {
                this.countries.push(location?.country?.name);
            }
        });

        this.project.project_funding.forEach((funding: any) => {
            if (!this.donors.includes(funding?.donor?.name)) {
                this.donors.push(funding?.donor?.name);
            }
        });
    }
}
