import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
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
    selector: 'app-grant-progress',
    templateUrl: './grant-progress.component.html',
    styleUrls: ['./grant-progress.component.scss']
})
export class GrantProgressComponent {
    grants: any = [];

    currentExpanded = new Set();

    constructor(private projectService: ProjectService, private toastr: ToastrService) { }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        const filters = {}
        this.projectService.fetch(filters).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = (res?.data ?? []) as Project[];
                this.grants = data;
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

    review(grant: any) {

    }

    handleIsOpenChange($event: boolean, section: number) {
        if ($event) {
            this.currentExpanded.add(section);
        } else {
            this.currentExpanded.delete(section);
        }
    }

    setOverallStatus(ev: any, grant: any) {
        ev.stopPropagation();
        const data = {
            pk: grant.pk,
            overall_grant_status: ev.target.value
        }
        this.projectService.setGrantOverallStatus(data).subscribe({
            next: (res: any) => {
                this.toastr.success(
                    `Overall Grant Status successfully saved`,
                    'SUCCESS!'
                );
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err)
                this.toastr.error(
                    `An error occurred while saving the Overall Grant Status. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }
}
