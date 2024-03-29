import { Component, OnInit, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

export const MAX_STEP = 7;
export const INITIAL_STEP = 1;

@Component({
    selector: 'app-application-new',
    templateUrl: './application-new.component.html',
    styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent implements OnInit {
    applicationSignalService = inject(ApplicationSignalService);
    loading = false;
    step = INITIAL_STEP;
    uuid = '';

    constructor(
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
    }

    appSignalEffect = effect(() => {
        this.step = this.applicationSignalService.currentNavStep();
        if (this.applicationSignalService.submitSave()) {
            this.handleSave();
        }
    });

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
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(
                    `An error occurred while saving grant application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.applicationSignalService.loadingInitialAppForm.set(false);
            },
        });
    }

    async handleSave() {
        const currentApplication = this.applicationSignalService.appForm();
        this.router.navigate(['public', 'application', currentApplication?.pk, 'success']);
    }
}
