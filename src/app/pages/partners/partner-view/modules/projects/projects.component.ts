import { Component, OnInit, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
    partner: PartnerForm | null = null;
    partnerSignalService = inject(PartnerSignalService);

    ngOnInit() {
        this.partner = this.partnerSignalService.partnerForm();
    }

    getDateEnd(duration: string, dateCreated?: Date) {
        const numberOfMonth = duration?.split(' ')?.at(0);
        if (dateCreated && numberOfMonth) {
            return DateTime.fromJSDate(new Date(dateCreated)).plus({ month: Number(numberOfMonth)}).toJSDate()
        }
        return ''
    }
}
