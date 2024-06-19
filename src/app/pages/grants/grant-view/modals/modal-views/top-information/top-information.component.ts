import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage, getDurationOpts } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../grant-view.component';
import { OTHER_CURRENCY_LIST, USD_CURRENCY } from 'src/app/utilities/constants';
import { InputDropdownValue } from 'src/app/pages/applications/application-new/modules/input-dropdown/input-dropdown.component';
import * as _ from '../../../../../../utilities/globals';
import { Application, Document, Partner } from 'src/app/interfaces/_application.interface';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { PartnerService } from 'src/app/services/partner.service';

interface PartnerItem extends Partner {
    applications?: Application[];
    expanded?: boolean;
    grand_total_amount?: number;
}

type SelectItem = {
    pk: number;
    name: string;
};

@Component({
    selector: 'app-top-information',
    templateUrl: './top-information.component.html',
    styleUrls: ['./top-information.component.scss'],
})
export class TopInformationComponent implements OnInit {
    @Input() project: Project | null;

    form: FormGroup;
    currentProject: Project | null = null;
    loading = true;
    partnerList: PartnerItem[];
    countryName: string = '';
    countryPk: number | undefined = undefined;
    usdCurrencies = USD_CURRENCY;
    availableCurrencies = OTHER_CURRENCY_LIST;
    otherCurrenciesDefaultSelected = OTHER_CURRENCY_LIST.at(0)?.key;
    durationOpts: string[] = [];
    attachments: Document[] = [];
    SERVER: string = _.BASE_URL;
    isSaved = false;
    processing = false;
    submitted = false;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private partnerService: PartnerService,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.fetchPartners();
        this.durationOpts = getDurationOpts();
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        this.currentProject = this.project;
        const partner = this.currentProject?.partner; // partner level
        const organization = this.currentProject?.partner?.organization; // partner level
        const projProposal = this.currentProject?.project_proposal;
        this.countryName = organization?.country?.name ?? '';
        this.countryPk = organization?.country?.pk;
        this.attachments = this.currentProject?.documents ?? [];
        this.form = this.formBuilder.group({
            partner_pk: [partner?.pk ?? '', Validators.required],
            name: [partner?.name ?? '', Validators.required],
            budget_request_usd: [projProposal?.budget_request_usd ?? '', Validators.required],
            budget_request_other: [projProposal?.budget_request_other ?? '', Validators.required],
            budget_request_other_currency: [projProposal?.budget_request_other_currency ?? '', Validators.required],
            duration: [this.currentProject?.duration ?? '', Validators.required],
            objective: [this.currentProject?.objective ?? '', Validators.required],
        });
        const selectedCurrencyKey = projProposal?.budget_request_other_currency?.split('-').at(0)?.trim();
        this.otherCurrenciesDefaultSelected =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;
    }

    fetchPartners() {
        this.loading = true;
        this.partnerService.fetch().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.partnerList = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Partners. Please try again.`, 'ERROR!');
                }

                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Partners. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    changeSelectionMapper = (key: string, item: SelectItem[]) => {
        if (key === 'country_pk') {
            this.countryName = item?.at(0)?.name ?? '';
        }

        if (key === 'partner_pk') {
            const selectedPartner = this.partnerList?.find((partner) => partner?.pk === item?.at(0)?.pk);
            this.countryName = selectedPartner?.organization?.country?.name ?? '';
            this.countryPk = selectedPartner?.organization?.country?.pk;
            this.form.controls['name'].setValue(item?.at(0)?.name ?? '');
        }
    };

    onChangeSelectedItem(item: SelectItem[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';
        if (pk) {
            this.form.controls[key].setValue(pk);
        } else {
            this.form.controls[key].setValue(extractedItem ?? '');
        }
        this.changeSelectionMapper(key, item);
    }

    onInputValueChange($event: InputDropdownValue, key: string) {
        if (key !== 'budget_request_usd') {
            const otherCurrencyLabel = $event?.selectedItem?.label;
            const otherCurrencyKey = $event?.selectedItem?.key;
            this.form.controls['budget_request_other_currency'].setValue(`${otherCurrencyKey} - ${otherCurrencyLabel}`);
        }
        this.form.controls[key].setValue($event?.value);
    }

    onSelectItemDropdown(_event: string, key: string) {
        if (key === 'budget_request_other') {
            this.form.controls[key].setValue('');
        }
    }

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.linkAttachment(res.file, type);
        });
    }

    linkAttachment(file: any, type: string) {
        this.projectService
            .saveSignedContractAttachment({ project_pk: this.project?.pk, file: file, type: type })
            .subscribe({
                next: (data: any) => {
                    this.attachments.push(file);
                    this.cdr.detectChanges();
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading attachments. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }

    deleteAttachment(i: number, type: string) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this attachment?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.projectService
                    .deleteProjectAttachment({
                        project_pk: this.project?.pk,
                        document_pk: this.attachments[i]?.pk,
                        type: 'document',
                    })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.attachments.splice(i, 1);
                            }
                        },
                        error: (error: any) => {
                            console.log(error);
                            this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                        },
                        complete: () => {
                            console.log('Complete');
                        },
                    });
            }
        );
    }

    updateProjectDetails() {
        const { value } = this.form;
        this.projectService
            .updateProjectDetails({
                pk: this.currentProject?.pk,
<<<<<<< HEAD
                application_pk: this.currentProject?.application_pk,
=======
>>>>>>> ae630e5 ([sc-458]: fix feedbacks)
                partner_pk: value?.partner_pk,
                objective: value?.objective,
                duration: value?.duration,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.toastr.success('Partner has been successfully saved', 'SUCCESS!');
                        this.currentProject = {
                            ...this.currentProject,
                            partner_pk: value?.partner_pk,
                            duration: value?.duration,
                            objective: value?.objective,
                            partner: {
                                ...this.currentProject?.partner,
                                pk: value?.partner_pk,
                                name: value?.name,
                                organization: {
                                    ...this.currentProject?.partner?.organization,
                                    country_pk: this.countryPk,
                                    country: {
                                        ...this.currentProject?.partner?.organization?.country,
                                        pk: this.countryPk,
                                        name: this.countryName,
                                    },
                                },
                            },
                        } as Project;
                        this.saveProjProposal();
                    } else {
                        this.toastr.error(`An error occurred while saving Partner. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Partner. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    saveProjProposal() {
        const { value } = this.form;
        const projProposal = this.currentProject?.project_proposal;
        this.applicationService
            .saveApplicationProposal({
                pk: projProposal?.pk,
                project_pk: this.currentProject?.pk,
                budget_request_other: value?.budget_request_other,
                budget_request_other_currency: value?.budget_request_other_currency,
                budget_request_usd: value?.budget_request_usd,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.currentProject = {
                            ...this.currentProject,
                            project_proposal: {
                                ...data,
                            },
                        } as Project;
                        this.toastr.success('Project Proposal has been successfully saved', 'SUCCESS!');
                        this.isSaved = true;
                        this.handleClose();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Project Proposal. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project Proposal. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.processing = true;
            this.updateProjectDetails();
        }
    }

    handleClose() {
        this.processChanges();
        this.bsModalRef.hide();
    }

    processChanges() {
        this.bsModalRef.onHidden?.next({
            isSaved: this.isSaved,
            data: {
                project: this.currentProject,
            },
        } as OnHiddenData);
    }
}
