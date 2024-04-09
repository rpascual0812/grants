import { Component, OnInit, effect, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { OnHiddenData } from '../../partner-view/partner-view.component';

const INITIAL_STEP = 1;
const MAX_STEP = 5;

@Component({
    selector: 'app-partner-add',
    templateUrl: './partner-add.component.html',
    styleUrls: ['./partner-add.component.scss'],
})
export class PartnerAddComponent implements OnInit {
    applicationSignalService = inject(ApplicationSignalService);
    step = INITIAL_STEP;
    constructor(public bsModalRef: BsModalRef) {}

    appSignalEffect = effect(
        () => {
            const submitSave = this.applicationSignalService.submitSave();
            this.step = this.applicationSignalService.currentNavStep();
            if (submitSave) {
                this.handleClose();
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

    handleClose() {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        if (partner?.pk) {
            this.bsModalRef.onHidden?.next({
                isSaved: true,
                data: {
                    ...partner,
                },
            } as OnHiddenData);
        }
        // Resets form
        this.applicationSignalService.submitSave.set(false);
        this.applicationSignalService.currentNavStep.set(INITIAL_STEP);
        this.bsModalRef.hide();
    }
}
