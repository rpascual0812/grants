import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';

@Component({
    selector: 'app-activities-timeline',
    templateUrl: './activities-timeline.component.html',
    styleUrls: ['./activities-timeline.component.scss'],
})
export class ActivitiesTimelineComponent implements OnInit {
    @Input() application: Application | null = null;

    constructor(private toastr: ToastrService) {}

    ngOnInit() {}

    getOtherCurrency(otherCurrency: string) {
        return getOtherCurrencyKey(otherCurrency);
    }
}
