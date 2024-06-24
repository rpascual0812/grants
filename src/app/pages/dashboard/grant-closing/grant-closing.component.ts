import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { DashboardSignalService } from 'src/app/services/dashboard.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

interface Grant {
    pk: number;
    partnerId: string;
    partner: string;
    title: string;
    applicationDate: Date;
    proposedBudget: number;
    proposedBudgetOther: number;
    proposedBudgetOtherCurrency: string;
    donorProject: string;
    status: string;
}

@Component({
    selector: 'app-grant-closing',
    templateUrl: './grant-closing.component.html',
    styleUrls: ['./grant-closing.component.scss']
})
export class GrantClosingComponent {
    grants: any = [];

    currentExpanded = new Set();

    dashboardSignalService = inject(DashboardSignalService);

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
    ) {
        effect(() => {
            this.dashboardSignalService.overallStatusSaved();
            this.fetch();
        });
    }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        const filters = {
            overall_grant_status: 'Approved'
        }
        this.projectService.fetch(filters).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                this.grants = data;

                this.dashboardSignalService.overallStatusSaved.set(false);
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err)
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    setClosingStatus(status: string, index: number) {
        const data = {
            pk: this.grants[index].pk,
            closing_status: status
        }
        this.projectService.setClosingStatus(data).subscribe({
            next: (res: any) => {
                this.toastr.success(
                    `Closing Status successfully saved`,
                    'SUCCESS!'
                );
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err)
                this.toastr.error(
                    `An error occurred while saving the Closing Status. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });

        this.grants[index].closing_status = status;
        this.cdr.detectChanges();
    }

    savePendingDocument(index: number) {
        const data = {
            pk: this.grants[index].pk,
            pending_document: this.grants[index].pending_document
        }
        this.projectService.savePendingDocument(data).subscribe({
            next: (res: any) => {
                this.toastr.success(
                    `Pending Document successfully saved`,
                    'SUCCESS!'
                );
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err)
                this.toastr.error(
                    `An error occurred while saving the Pending Document. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }
}
