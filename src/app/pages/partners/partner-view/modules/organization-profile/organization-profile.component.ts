import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerEditModalComponent } from '../../../modals/partner-edit-modal/partner-edit-modal.component';
import { OnHiddenData } from '../../partner-view.component';
import { KIND_OF_ORGANIZATION_MAPPER } from 'src/app/utilities/constants';
import { Country, KindOfOrganization, OrganizationPartnerType } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-organization-profile',
    templateUrl: './organization-profile.component.html',
    styleUrls: ['./organization-profile.component.scss'],
})
export class OrganizationProfileComponent implements OnInit {
    loading = false;
    partner: PartnerForm | null = null;
    listOfOrgs: KindOfOrganization[] = [];
    kindOfOrg = '';

    listOfOrgPartnerTypes: OrganizationPartnerType[] = [];
    orgPartnerType = '';

    listOfCountry: Country[] = [];
    countryName = '';
    partnerSignalService = inject(PartnerSignalService);

    constructor(
        private globalService: GlobalService,
        private toastr: ToastrService,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef
    ) { }

    partnerSignalEffect = effect(
        () => {
            const section = this.partnerSignalService?.editSectionKey();
            if (section === 'organizationProfile') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.partner = this.partnerSignalService.partnerForm();
        this.countryName = (this.partner?.organization as any)?.country?.name;
        this.fetchOrganization();
        this.fetchCountry();
        this.fetchOrgPartnerType()
    }

    fetchOrganization() {
        this.loading = true;
        this.globalService.selectFetch(`organization`).subscribe({
            next: (res: any) => {
                const data = res?.data;
                const status = res?.status;
                if (status) {
                    const organizationPk = this.partner?.organization?.organization_pk;
                    this.listOfOrgs = data;
                    this.kindOfOrg = this.getKindOfOrgName(organizationPk ?? null, this.listOfOrgs);
                } else {
                    this.toastr.error(`An error occurred while fetching organization. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching organization. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    getKindOfOrgName(organizationPk: number | null, listOfOrgs: any[]) {
        const kindOfOrgName = listOfOrgs?.find((item: any) => item.pk === organizationPk)?.name;
        if (kindOfOrgName === KIND_OF_ORGANIZATION_MAPPER[4]) {
            return `${kindOfOrgName} - ${this.partner?.organization?.tribe ?? ''}`;
        } else {
            return kindOfOrgName;
        }
    }

    fetchOrgPartnerType() {
        this.loading = true;
        this.globalService.selectFetch(`organization/partner_type`).subscribe({
            next: (res: any) => {
                const data = res?.data;
                const status = res?.status;
                if (status) {
                    const organizationPk = this.partner?.organization?.organization_partner_type_pk;
                    this.listOfOrgPartnerTypes = data;
                    this.orgPartnerType =
                        this.listOfOrgPartnerTypes?.find((item: any) => item.pk === organizationPk)?.name ?? '';
                } else {
                    this.toastr.error(`An error occurred while fetching organization partner type. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching organization partner type. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    fetchCountry() {
        this.loading = true;
        this.globalService.selectFetch(`country`).subscribe({
            next: (res: any) => {
                const data = res?.data;
                const status = res?.status;
                if (status) {
                    const countryPk = this.partner?.organization?.country_pk;
                    this.listOfCountry = data;
                    this.countryName = this.listOfCountry?.find((item: any) => item.pk === countryPk)?.name ?? '';
                } else {
                    this.toastr.error(`An error occurred while fetching country. Please try again.`, 'ERROR!');
                }
                this.loading = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loading = false;
            },
        });
    }

    handleModal() {
        const section = this.partnerSignalService?.editSectionKey();
        this.bsModalRef = this.modalService.show(PartnerEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                partner: this.partner,
                section,
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (this.partner && isSaved) {
                this.partner = data;
                const organizationPk = data?.organization?.organization_pk;
                this.kindOfOrg = this.getKindOfOrgName(organizationPk ?? null, this.listOfOrgs);
                this.countryName =
                    this.listOfCountry?.find((item: any) => item.pk === data?.organization?.country_pk)?.name ?? '';
                this.orgPartnerType =
                    this.listOfOrgPartnerTypes?.find(
                        (item: any) => item.pk === data?.organization?.organization_partner_type_pk
                    )?.name ?? '';
                this.changeDetection.detectChanges();
            }
        });
        this.partnerSignalService.editSectionKey.set(null);
    }
}
