import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';
import { TemplateService } from 'src/app/services/template.service';

declare var tinymce: any;

@Component({
    selector: 'app-email-templates',
    templateUrl: './email-templates.component.html',
    styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {
    @ViewChild('passwordReset') passwordResetEditor: TextEditorComponent;
    @ViewChild('application') applicationEditor: TextEditorComponent;
    @ViewChild('applicationSubmitted') applicationSubmittedEditor: TextEditorComponent;

    form: FormGroup;
    loading = false;
    template: any = {
        passwordResetSubject: '',
        passwordReset: '',
        applicationSubject: '',
        application: '',
        applicationSubmittedSubject: '',
        applicationSubmitted: ''
    }

    templates: any = [];

    submitted: boolean = false;

    variables = {
        passwordResetVariables: [
            'first_name',
            'middle_name',
            'last_name',
            'email_address',
            'unique_id',
            'reset_password_url'
        ],
        applicationVariables: [
            'first_name',
            'middle_name',
            'last_name',
            'email_address',

            'application_url',
        ],
        applicationSubmittedVariables: [
            'first_name',
            'middle_name',
            'last_name',
            'email_address',

            'application_date',
            'application_donor',
            'application_number',
            'application_url',
            'application_uuid',

            'proponent_address',
            'proponent_contact_number',
            'proponent_email',
            'proponent_id',
            'proponent_name',
            'proponent_website',
            'proponent_organization_name',

            'project_amount_requested',
            'project_background',
            'project_country',
            'project_local_currency',
            'project_local_amount',
            'project_usd_amount',
            'project_duration',
            'project_title',
        ]
    };

    constructor(
        private formBuilder: FormBuilder,
        private templateService: TemplateService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        tinymce.init(
            {
                selector: "#message",
            }
        );

        this.setForm();
        this.fetch();
    }

    setForm() {
        this.form = this.formBuilder.group({
            passwordResetSubject: [this.template.passwordResetSubject ? this.template.passwordResetSubject : '', Validators.required],
            passwordReset: [this.template.passwordReset ? this.template.passwordReset : '', Validators.required],
            applicationSubject: [this.template.applicationSubject ? this.template.applicationSubject : '', Validators.required],
            application: [this.template.application ? this.template.application : '', Validators.required],
            applicationSubmittedSubject: [this.template.applicationSubmittedSubject ? this.template.applicationSubmittedSubject : '', Validators.required],
            applicationSubmitted: [this.template.applicationSubmitted ? this.template.applicationSubmitted : '', Validators.required],
        });
    }

    get f() { return this.form.controls; }

    fetch() {
        this.templateService.fetchAll()
            .subscribe({
                next: (data: any) => {
                    this.templates = data.data;

                    data.data.forEach((template: any) => {
                        this.template[template.type] = template.template;

                        this.form.get('passwordResetSubject')?.patchValue(this.templates.filter((template: any) => template.type == 'passwordReset')[0].subject);
                        this.form.get('applicationSubject')?.patchValue(this.templates.filter((template: any) => template.type == 'application')[0].subject);
                        this.form.get('applicationSubmittedSubject')?.patchValue(this.templates.filter((template: any) => template.type == 'applicationSubmitted')[0].subject);
                    });

                    this.cdr.detectChanges();
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }

    submit() {
        this.submitted = true;
        const passwordReset = this.passwordResetEditor.returnMessage();
        const application = this.applicationEditor.returnMessage();
        const applicationSubmitted = this.applicationSubmittedEditor.returnMessage();

        this.form.get('passwordReset')?.patchValue(passwordReset);
        this.form.get('application')?.patchValue(application);
        this.form.get('applicationSubmitted')?.patchValue(applicationSubmitted);

        if (this.form.invalid) {
            this.toastr.error('Please complete the form.', 'ERROR!');
            return;
        }

        const data: any = [
            {
                type: 'passwordReset',
                subject: this.form.value.passwordResetSubject,
                template: this.form.value.passwordReset
            },
            {
                type: 'application',
                subject: this.form.value.applicationSubject,
                template: this.form.value.application
            },
            {
                type: 'applicationSubmitted',
                subject: this.form.value.applicationSubmittedSubject,
                template: this.form.value.applicationSubmitted
            }
        ];

        this.templateService
            .save(data)
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The templates have been successfully updated', 'SUCCESS!');
                },
                error: (error: any) => {
                    this.submitted = false;
                    console.log(error);
                    this.toastr.error('An error occurred while updating the templates. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    this.submitted = false;
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }

}
