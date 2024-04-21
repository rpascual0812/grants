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

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent implements OnInit {
    @Input() project: Project | null = null;
    @Output() callback = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {
        console.log(this.project);
    }

    recommendationSaved() {
        this.callback.emit(true);
    }
}
