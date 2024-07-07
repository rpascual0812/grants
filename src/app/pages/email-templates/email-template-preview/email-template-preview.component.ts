import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';
import { ApplicationService } from 'src/app/services/application.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from '../../../utilities/globals';
import { DateTime } from 'luxon';
import { EmailService } from 'src/app/services/email.service';

@Component({
    selector: 'app-email-template-preview',
    templateUrl: './email-template-preview.component.html',
    styleUrls: ['./email-template-preview.component.scss']
})
export class EmailTemplatePreviewComponent implements OnInit {
    @ViewChild('texteditor') newTextEditor: TextEditorComponent;

    @Input() name: string = '';
    @Input() subject: string = '';
    @Input() template: string = '';
    @Input() variables: any = [];

    url: string = _.BASE_URL;

    users: any = [];
    userList: any = [];

    applications: any = [];
    applicationList: any = [];

    form: any = {
        recipients: '',
        subject: '',
        body: ''
    }

    error: boolean = false;

    constructor(
        public bsModalRef: BsModalRef,
        public applicationService: ApplicationService,
        public userService: UserService,
        public toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private emailService: EmailService
    ) { }

    ngOnInit() {
        this.form.subject = this.subject;

        this.fetchUsers();
        this.fetchApplications();
    }

    fetchUsers() {
        this.userService.fetchAll({}).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                this.users = data;
                this.userList = data.map((user: any) => user.first_name + ' ' + user.last_name);
            },
            error: (err) => {
                this.toastr.error('An error occurred while fetching Provinces', 'ERROR!');
            },
        });
    }

    fetchApplications() {
        this.applicationService.fetch({}).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                this.applications = data;
                this.applicationList = data.map((application: any) => application.number);
            },
            error: (err) => {
                this.toastr.error('An error occurred while fetching Provinces', 'ERROR!');
            },
        });
    }

    setUser(ev: any) {
        const user = this.users.filter((user: any) => user.first_name + ' ' + user.last_name == ev)[0];
        let body = this.template;

        const password = Math.random()
            .toString(36)
            .slice(-8);

        body = body.replace(/{first_name}/g, user.first_name ?? '');
        body = body.replace(/{middle_name}/g, user.middle_name ?? '');
        body = body.replace(/{last_name}/g, user.last_name ?? '');
        body = body.replace(/{email_address}/g, user.email_address ?? '');
        body = body.replace(/{unique_id}/g, user.unique_id ?? '');
        body = body.replace(/{temporary_password}/g, password ?? '');
        body = body.replace(/{app_url}/g, this.url);

        body = body.replace(/{reset_password_url}/g, this.url + '/reset-password/' + user.uuid);

        this.newTextEditor.set(body);
        this.cdr.detectChanges();
    }

    setApplication(ev: any) {
        const application = this.applications.filter((application: any) => application.number == ev)[0];
        let body = this.template;

        body = body.replace(/{partner_name}/g, application.partner?.name ?? '');
        body = body.replace(/{email_address}/g, application.partner?.email_address ?? '');
        body = body.replace(/{application_url}/g, this.url + '/public/application/' + application.uuid ?? '');

        body = body.replace(/{proponent_name}/g, application.partner?.name ?? '');
        body = body.replace(/{proponent_id}/g, application.partner?.partner_id ?? '');

        body = body.replace(/{application_date}/g, DateTime.fromISO(application.date_submitted).toFormat('LLLL dd, yyyy') ?? '');
        body = body.replace(/{project_title}/g, application.project?.title ?? '');
        body = body.replace(/{project_country}/g, application.project?.project_location[0]?.country?.name ?? '');
        body = body.replace(/{project_duration}/g, application.project?.duration ?? '');
        body = body.replace(/{project_local_currency}/g, application.project?.project_proposal?.budget_request_other_currency ?? '');
        body = body.replace(/{project_local_amount}/g, application.project?.project_proposal?.budget_request_other ?? '');
        body = body.replace(/{project_usd_amount}/g, application.project?.project_proposal?.budget_request_usd ?? '');

        this.newTextEditor.set(body);
        this.cdr.detectChanges();
    }

    send() {
        this.form.body = this.newTextEditor.returnMessage();

        if (this.form.recipients.replace(/\s/g, '') == '' ||
            this.form.subject.replace(/\s/g, '') == '' ||
            this.form.body.replace(/\s/g, '') == '') {
            this.error = true;

            setTimeout(() => {
                this.error = false;
                this.cdr.detectChanges();
            }, 3000);
        }
        else {
            this.emailService
                .save(this.form)
                .subscribe({
                    next: (data: any) => {
                        this.toastr.success('The templates have been successfully updated', 'SUCCESS!');
                    },
                    error: (error: any) => {
                        this.toastr.error('An error occurred while sending an email. Please try again', 'ERROR!');
                    },
                    complete: () => {

                    }
                });
        }
    }
}
