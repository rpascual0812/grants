import { Component, OnInit, inject } from '@angular/core';
import { Project } from 'src/app/interfaces/_application.interface';
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
}
