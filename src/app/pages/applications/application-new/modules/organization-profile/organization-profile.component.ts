import { Component, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-organization-profile',
    templateUrl: './organization-profile.component.html',
    styleUrls: ['./organization-profile.component.scss'],
})
export class OrganizationProfileComponent implements OnInit {
    // used for referencing organization options
    // kindOfOrgOpts: string[] = [
    //     `Community/informal`,
    //     `Local organization/People's organization`,
    //     `Non-Government organization`,
    //     `Other organizations`,
    // ];

    form: FormGroup;
    boolOpts = ['Yes', 'No'];
    selectedItem: string = '';
    submitted = false;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        this.form = this.formBuilder.group({
            organization_pk: [currentApplication?.organization_profile?.organization_pk ?? '', Validators.required],
            mission: [currentApplication?.organization_profile?.mission ?? ''],
            vision: [currentApplication?.organization_profile?.vision ?? ''],
            description: [currentApplication?.organization_profile?.description ?? ''],
            country_pk: [currentApplication?.organization_profile?.country_pk ?? '', Validators.required],
            project_website: [currentApplication?.organization_profile?.project_website ?? ''],
            archived: [false],
        });
    }

    onChangeSelectedItem(item: { pk: number; name: string }[], key: string) {
        const pk = item.at(0)?.pk ?? '';
        this.form.controls[key].setValue(pk);
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            organization_profile: {
                ...value,
            },
        });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
            this.applicationSignalService.navigateNext();
        }
    }

    handleBack() {
        this.saveFormValue();
        this.applicationSignalService.navigateBack();
    }
}
