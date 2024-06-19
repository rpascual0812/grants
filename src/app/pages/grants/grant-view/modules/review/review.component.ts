import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Project } from 'src/app/interfaces/_project.interface';
import * as _ from '../../../../../utilities/globals';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent implements OnInit {
    @Input() project: Project | null = null;
    @Output() callback = new EventEmitter<boolean>();

    application: Application | null = null;

    constructor(
        private applicationService: ApplicationService
    ) { }

    ngOnInit() {
        this.fetchApplication();
    }

    recommendationSaved() {
        this.callback.emit(true);
    }

    fetchApplication() {
        this.applicationService.review(this.project?.application?.number).subscribe({
            next: (res: any) => {
                const data: Application = res?.data ?? null;

                this.application = data;
            },
            error: (err: any) => {
                console.log(err);
            },
        });
    }
}
