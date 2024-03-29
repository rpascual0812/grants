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
        this.fetch()
    }

    async fetch() {
        this.applicationService.generated(this.uuid).subscribe({
            next: (res: any) => {
                const data = res?.data
                this.applicationSignalService.appForm.set(data)
                this.applicationSignalService.loadingInitialAppForm.set(false)
            },
            error: (err) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(
                    `An error occurred while saving grant application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.applicationSignalService.loadingInitialAppForm.set(false)
            }
        })
    }

    async handleSave() {
        this.loading = true;
        const payload = this.applicationSignalService.application();
        this.applicationService
            .store({
                uuid: this.uuid,
                ...payload,
            })
            .subscribe({
                next: (res: any) => {
                    this.loading = false;
                    const data = res?.data;
                    const status = res?.status;
                    const code = res?.code ? `code: ${res?.code}` : '';
                    if (!status) {
                        this.toastr.error(
                            `An error occurred while saving grant application. Please try again. ${code}`,
                            'ERROR!'
                        );
                    } else {
                        this.toastr.success('The application has been successfully created', 'SUCCESS!');
                        this.router.navigate(['public', 'application', data?.application?.pk, 'success']);
                    }
                    this.applicationSignalService.submitSave.set(false);
                },
                error: (err: any) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving grant application. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    setTimeout(() => {
                        this.loading = false;
                        this.applicationSignalService.submitSave.set(false);
                    }, 500);
                },
            });
    }
}
