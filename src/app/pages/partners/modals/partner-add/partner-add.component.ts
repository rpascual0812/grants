import { Component, OnInit, effect, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { OnHiddenData } from '../../partner-view/partner-view.component';
import { PartnerService } from 'src/app/services/partner.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { Partner } from 'src/app/interfaces/_application.interface';

const INITIAL_STEP = 1;
const MAX_STEP = 5;

@Component({
    selector: 'app-partner-add',
    templateUrl: './partner-add.component.html',
    styleUrls: ['./partner-add.component.scss'],
})
export class PartnerAddComponent implements OnInit {
    applicationSignalService = inject(ApplicationSignalService);
    newPartnerId: string;
    step = INITIAL_STEP;
    constructor(public bsModalRef: BsModalRef, private partnerService: PartnerService, private toastr: ToastrService) { }

    appSignalEffect = effect(
        () => {
            const submitSave = this.applicationSignalService.submitSave();
            this.step = this.applicationSignalService.currentNavStep();
            if (submitSave) {
                this.generatePartnerId();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.step = INITIAL_STEP;
        this.applicationSignalService.INITIAL_STEP = this.step;
        this.applicationSignalService.MAX_STEP = MAX_STEP;
        this.applicationSignalService.appForm.set(null);
        this.applicationSignalService.loadingInitialAppForm.set(false);
    }

    generatePartnerId() {
        const currentApplication = this.applicationSignalService.appForm();
        this.partnerService
            .generatePartnerId({
                pk: currentApplication?.partner?.pk,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data as Partner;
                    if (status) {
                        this.newPartnerId = data?.partner_id ?? '';

                        this.handleClose();
                    } else {
                        this.toastr.error(`An error occurred while generating partner id. Please try again.`, 'ERROR!');
                    }
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while generating partner id after saving application. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleClose() {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        if (partner?.pk) {
            this.bsModalRef.onHidden?.next({
                isSaved: true,
                data: {
                    ...partner,
                    partner_id: this.newPartnerId,
                },
            } as OnHiddenData);
        }
        // Resets form
        this.applicationSignalService.submitSave.set(false);
        this.applicationSignalService.currentNavStep.set(INITIAL_STEP);
        this.bsModalRef.hide();
    }
}
