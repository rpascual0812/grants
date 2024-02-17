import { Component, effect, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';

import { ToastrService } from 'ngx-toastr';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-proponent-information',
    templateUrl: './proponent-information.component.html',
    styleUrls: ['./proponent-information.component.scss'],
})
export class ProponentInformationComponent {
    form: FormGroup;
    submitted: boolean = false;
    loading: boolean = false;

    applicationSignalService = inject(ApplicationSignalService);

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {
        effect(() => {
            if (this.applicationSignalService.navigateNext() == true) {
                this.submit();
            }
        });
    }

    ngOnInit(): void {
        this.setForm();
    }

    get f() { return this.form.controls; }

    setForm() {
        this.form = this.formBuilder.group({
            pk: [''],
            name: ['', Validators.required],
            archived: [false]
        });
    }

    submit() {
        console.log('submitted', this.form.value);
        this.applicationService
            .store(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The application has been successfully updated', 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }
}
