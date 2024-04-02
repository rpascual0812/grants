import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerEditModalComponent } from '../../../modals/partner-edit-modal/partner-edit-modal.component';
import { OnHiddenData } from '../../partner-view.component';

@Component({
    selector: 'app-organization-profile',
    templateUrl: './organization-profile.component.html',
    styleUrls: ['./organization-profile.component.scss'],
})
export class OrganizationProfileComponent implements OnInit {
    loading = false;
    partner: PartnerForm | null = null;
    listOfOrgs: any[] = [];
    kindOfOrg = '';
    listOfCountry: any[] = [];
    countryName = '';
    partnerSignalService = inject(PartnerSignalService);

    constructor(
        private globalService: GlobalService,
        private toastr: ToastrService,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef
    ) {}

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
                    this.kindOfOrg = this.listOfOrgs?.find((item: any) => item.pk === organizationPk)?.name;
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

    fetchCountry() {
        this.loading = true;
        this.globalService.selectFetch(`country`).subscribe({
            next: (res: any) => {
                const data = res?.data;
                const status = res?.status;
                if (status) {
                    const countryPk = this.partner?.organization?.country_pk;
                    this.listOfCountry = data;
                    this.countryName = this.listOfCountry?.find((item: any) => item.pk === countryPk)?.name;
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
                this.kindOfOrg = this.listOfOrgs?.find(
                    (item: any) => item.pk === data?.organization?.organization_pk
                )?.name;
                this.countryName = this.listOfCountry?.find(
                    (item: any) => item.pk === data?.organization?.country_pk
                )?.name;
                this.changeDetection.detectChanges();
            }
        });
        this.partnerSignalService.editSectionKey.set(null);
    }
}
