import { ApplicationReviewSignalService } from './../../../services/appliaction-review.signal.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { Country } from 'src/app/interfaces/country.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-application-review',
    templateUrl: './application-review.component.html',
    styleUrls: ['./application-review.component.scss'],
})
export class ApplicationReviewComponent implements OnInit {
    loading = false;
    applicationNumber: string = '';
    currentApplication: ApplicationRead | null = null;
    countryList: Country[] = [];

    applicationReviewSignalService = inject(ApplicationReviewSignalService);
    constructor(
        private route: ActivatedRoute,
        private applicationService: ApplicationService,
        private globalService: GlobalService
    ) {
        this.applicationNumber = this.route.snapshot.paramMap.get('number') ?? '';
    }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.applicationService.review(this.applicationNumber).subscribe({
            next: (res: any) => {
                const data: ApplicationRead = res?.data ?? null;
                this.applicationReviewSignalService.applicationReview.set({
                    ...data,
                });
                console.log(data);
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
        const currencySymbol = otherCurrencySymbol?.split('-')
        return `${currencySymbol?.at(0)} ${otherCurrencyValue}`
    }
}
