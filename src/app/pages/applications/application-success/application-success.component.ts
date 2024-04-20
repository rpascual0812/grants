import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-application-success',
    templateUrl: './application-success.component.html',
    styleUrls: ['./application-success.component.scss'],
})
export class ApplicationSuccessComponent implements OnInit {
    loading = false;
    uuid: string = '';
    application: Application | null = null;

    constructor(private applicationService: ApplicationService, route: ActivatedRoute, private toastr: ToastrService) {
        this.uuid = route.snapshot.paramMap.get('uuid') ?? '';
    }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.applicationService.generated(this.uuid).subscribe({
            next: (res: any) => {
                const data = res?.data as Application;
                this.application = data;
                this.loading = false;

                this.sendEmail(data);
            },
            error: (err) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(
                    `An error occurred while fetching application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    sendEmail(data: any) {
        this.applicationService.sendSuccessEmail(data.pk).subscribe({
            next: (res: any) => {},
            error: (err) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
            },
        });
    }
}
