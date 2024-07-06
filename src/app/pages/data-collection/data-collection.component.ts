import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-data-collection',
    templateUrl: './data-collection.component.html',
    styleUrls: ['./data-collection.component.scss']
})
export class DataCollectionComponent implements OnInit {
    dateNow: string | null = null;
    submitted: boolean = false;

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.dateNow = DateTime.now().toFormat('ccc, LLLL dd, yyyy');
    }

    get f() {
        return this.form.controls;
    }

    onChangeSelectedItem(ev: any) {

    }
}
