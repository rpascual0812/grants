import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

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

        console.log(this.currentExpanded);
    }

    handleOnEdit($event: MouseEvent, section: string) {
        $event.stopPropagation();
        console.log('section', section);
    }
}
