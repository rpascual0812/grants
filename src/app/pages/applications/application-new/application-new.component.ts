import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

export const MAX_STEP = 7;
export const INITIAL_STEP = 1;

@Component({
    selector: 'app-application-new',
    templateUrl: './application-new.component.html',
    styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent {
    applicationSignalService = inject(ApplicationSignalService);
    loading = false;
    step = INITIAL_STEP;
    uuid = '';

    constructor(private applicationService: ApplicationService, private toastr: ToastrService, route: ActivatedRoute) {
        this.uuid = route.snapshot.paramMap.get('uuid') ?? '';

        effect(() => {
            this.step = this.applicationSignalService.currentNavStep();
            if (this.applicationSignalService.submitSave()) {
                this.handleSave();
            }
        });
    }

    async handleSave() {
        this.loading = true;
        const payload = this.applicationSignalService.application();
        this.applicationService
            .store({
                uuid: '3a4cb875-dc5d-4b11-b073-fafd0a76b09f',
                ...payload,
            })
            .subscribe({
                next: (data: any) => {
                    this.loading = false;
                    this.toastr.success('The application has been successfully created', 'SUCCESS!');
                    this.applicationSignalService.submitSave.set(false);
                },
                error: (error: any) => {
                    this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                    setTimeout(() => {
                        this.loading = false;
                        this.applicationSignalService.submitSave.set(false);
                    }, 500);
                },
                complete: () => {
                    setTimeout(() => {
                        this.loading = false;
                        this.applicationSignalService.submitSave.set(false);
                    }, 500);
                },
            });
    }
}
