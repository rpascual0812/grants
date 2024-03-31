import { ApplicationReviewSignalService } from './../../../services/appliaction-review.signal.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { Country } from 'src/app/interfaces/country.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { GlobalService } from 'src/app/services/global.service';
import * as _ from '../../../utilities/globals';

type GrantTypeItem = {
    pk?: number;
    name: string;
    description?: string
};
@Component({
    selector: 'app-application-review',
    templateUrl: './application-review.component.html',
    styleUrls: ['./application-review.component.scss'],
})
export class ApplicationReviewComponent implements OnInit {
    submitted: boolean = false;
    loading: boolean = false;
    applicationNumber: string = '';
    currentApplication: ApplicationRead | null = null;
    countryList: Country[] = [];

    form: FormGroup;

    applicationReviewSignalService = inject(ApplicationReviewSignalService);
    constructor(
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private applicationService: ApplicationService,
        private globalService: GlobalService,
        private formBuilder: FormBuilder,
    ) {
        this.applicationNumber = this.route.snapshot.paramMap.get('number') ?? '';
    }

    ngOnInit() {
        this.fetch();
    }

    get f() { return this.form.controls; }

    fetch() {
        this.loading = true;
        this.applicationService.review(this.applicationNumber).subscribe({
            next: (res: any) => {
                const data: ApplicationRead = res?.data ?? null;
                this.applicationReviewSignalService.applicationReview.set({
                    ...data,
                });

                this.currentApplication = data;
                this.loading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.loading = false;
            },
        });
    }

    getProposedBudget(otherCurrencySymbol?: string, otherCurrencyValue?: string) {
        const currencySymbol = otherCurrencySymbol?.split('-');
        return `${currencySymbol?.at(0)} ${otherCurrencyValue}`;
    }

    onChangeGrantType(item: GrantTypeItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as GrantTypeItem)?.['pk' ?? ''] ?? '';
        const data = {
            application_pk: this.currentApplication?.pk,
            project: {
                type_pk: pk
            }
        }

        this.applicationService.store(data).subscribe({
            next: (res: any) => {
                this.toastr.success('The Grant Type has been successfully saved', 'SUCCESS!');
            },
            error: (err: any) => {
                console.log(err);
            },
        });

    }
}
