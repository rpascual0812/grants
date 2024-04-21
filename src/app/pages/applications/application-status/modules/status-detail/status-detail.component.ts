import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Application } from 'src/app/interfaces/_application.interface';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-status-detail',
    templateUrl: './status-detail.component.html',
    styleUrls: ['./status-detail.component.scss']
})
export class StatusDetailComponent implements OnInit {
    @Input() application: Application | null = {};

    constructor(
        private globalService: GlobalService,
        private formBuilder: FormBuilder,
    ) {

    }

    ngOnInit() {

    }
}
