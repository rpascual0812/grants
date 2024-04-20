import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

export type OnHiddenData = {
    isSaved: boolean;
    data: {
        application: Application | null;
    };
};
@Component({
    selector: 'app-grant-view',
    templateUrl: './grant-view.component.html',
    styleUrls: ['./grant-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantViewComponent implements OnInit {
    loading = true;
    application: Application | null = null;
    pk = '';
    currentExpanded = new Set();

    grantSignalService = inject(GrantSignalService);
    constructor(
        private applicationService: ApplicationService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.pk = this.route.snapshot.paramMap.get('pk') ?? '';
    }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.applicationService.fetchOne(this.pk).subscribe({
            next: (res: any) => {
                const data = res?.data as Application;
                const status = res?.status;
                if (status) {
                    this.application = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Application. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
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
        this.grantSignalService.editSectionKey.set(section);
    }
}
