import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartnerService } from 'src/app/services/partner.service';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

export type OnHiddenData = {
    isSaved: boolean;
    data: PartnerForm;
};

@Component({
    selector: 'app-partner-view',
    templateUrl: './partner-view.component.html',
    styleUrls: ['./partner-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PartnerViewComponent implements OnInit {
    partnerId: string = '';
    currentExpanded = new Set();

    partnerSignalService = inject(PartnerSignalService);

    constructor(private partnerService: PartnerService, private route: ActivatedRoute, private toastr: ToastrService) {
        this.partnerId = this.route.snapshot.paramMap.get('partnerId') ?? '';
    }

    ngOnInit() {
        this.partnerSignalService.loadingInitialPartnerForm.set(true);
        this.fetch();
    }

    fetch() {
        this.partnerService.fetchOne(this.partnerId).subscribe({
            next: (res: any) => {
                const data = res?.data as PartnerForm;
                const status = res?.status;
                if (status) {
                    this.partnerSignalService.partnerForm.set(data);
                } else {
                    this.toastr.error(`An error occurred while fetching Partner. Please try again.`, 'ERROR!');
                }
                this.partnerSignalService.loadingInitialPartnerForm.set(false);
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Partner. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.partnerSignalService.loadingInitialPartnerForm.set(false);
            },
        });
    }

    handleIsOpenChange($event: boolean, section: string) {
        if ($event) {
            this.currentExpanded.add(section);
        } else {
            this.currentExpanded.delete(section);
        }
    }

    handleOnEdit($event: MouseEvent, section: string) {
        $event.stopPropagation();
        this.partnerSignalService.editSectionKey.set(section);
    }
}
