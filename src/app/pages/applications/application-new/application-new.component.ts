import { Component, OnInit, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { PartnerService } from 'src/app/services/partner.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

export const MAX_STEP = 7;
export const INITIAL_STEP = 1;

@Component({
    selector: 'app-application-new',
    templateUrl: './application-new.component.html',
    styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent implements OnInit {
    applicationSignalService = inject(ApplicationSignalService);
    initialLoading = false;
    step = INITIAL_STEP;
    uuid = '';

    constructor(
        private applicationService: ApplicationService,
        private partnerService: PartnerService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
        this.applicationSignalService.INITIAL_STEP = INITIAL_STEP;
        this.applicationSignalService.MAX_STEP = MAX_STEP;
    }

    appSignalEffect = effect(
        () => {
            this.initialLoading = this.applicationSignalService.loadingInitialAppForm();
            this.step = this.applicationSignalService.currentNavStep();
            if (this.applicationSignalService.submitSave()) {
                this.handleSave();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.fetch();
    }

    async fetch() {
        this.applicationService.generated(this.uuid).subscribe({
            next: (res: any) => {
                const data = res?.data;
                this.applicationSignalService.appForm.set(data);
                this.applicationSignalService.loadingInitialAppForm.set(false);
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while saving grant application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.applicationSignalService.loadingInitialAppForm.set(false);
            },
        });
    }

    generatePartnerId(currentApplication: Application | null) {
        this.partnerService
            .generatePartnerId({
                pk: currentApplication?.partner?.pk,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.applicationSignalService.appForm.set(null);
                        this.router.navigate(['public', 'application', currentApplication?.uuid, 'success']);
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

    handleSave() {
        const currentApplication = this.applicationSignalService.appForm();
        this.generatePartnerId(currentApplication);
    }
}
