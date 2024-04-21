import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { GlobalService } from 'src/app/services/global.service';
import * as _ from '../../../utilities/globals';
import { Application } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-application-status',
    templateUrl: './application-status.component.html',
    styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
    uuid: string = '';
    loading: boolean = false;
    application: Application | null = null;

    constructor(
        private route: ActivatedRoute,
        private applicationService: ApplicationService,
        private globalService: GlobalService,
        private formBuilder: FormBuilder,
    ) {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
    }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.applicationService.generated(this.uuid).subscribe({
            next: (res: any) => {
                const data: Application = res?.data ?? null;

                this.application = data;
                this.loading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.loading = false;
            },
        });
    }
}
