import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import * as _ from '../../../utilities/globals';
import { THEMATIC_AREAS } from 'src/app/utilities/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerAddComponent } from '../modals/partner-add/partner-add.component';
import { OnHiddenData } from '../partner-view/partner-view.component';
import { Application, Partner } from 'src/app/interfaces/_application.interface';
import { DateTime } from 'luxon';

interface PartnerList extends Partner {
    applications?: Application[];
    expanded?: boolean;
    grand_total_amount?: number;
}

type SelectItem = {
    pk: number;
    name: string;
};

type Filter = {
    organization_pk: number | null;
    type_pk: number | null;
    keyword?: string | null;
    partner_date_created_year?: string | null
};

@Component({
    selector: 'app-partners-list',
    templateUrl: './partners-list.component.html',
    styleUrls: ['./partners-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PartnersListComponent implements OnInit {
    tableSizes: any = _.TABLE_SIZES;
    thematicAreas = THEMATIC_AREAS;

    loading = false;
    oneAtATime = true;
    partnersList: PartnerList[] = [];

    page: number = 1;
    tableSize: number = 10;

    filter: Filter = {
        organization_pk: null,
        type_pk: null,
        keyword: '',
        partner_date_created_year: '',
    };

    bsModalRef?: BsModalRef;

    constructor(
        private partnerService: PartnerService,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.fetch();
    }

    fetch(filter?: Filter) {
        this.loading = true;
        this.partnerService
            .fetch({
                ...filter,
            })
            .subscribe({
                next: (response: any) => {
                    const data: PartnerList[] = response?.data ?? [];
                    this.partnersList = data.map((item, idx: number) => ({
                        ...item,
                        expanded: false,
                        applications: item?.applications?.filter((app) => !!app?.project?.title) ?? [],
                    }));
                    this.loading = false;
                },
                error: (err) => {
                    this.loading = false;
                },
            });
    }

    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';
        const tempKey = key as keyof Filter;
        if (tempKey === 'organization_pk' || tempKey === 'type_pk') {
            this.filter[tempKey] = pk;
            this.fetch(this.filter);
        }
    }

    handleSearchKeyword() {
        this.fetch(this.filter)
    }

    handleClearKeyword() {
        this.filter.keyword = ''
        this.fetch(this.filter)
    }

    handleFilterDateCreatedByYear($event: any) {
        const year = $event ? DateTime.fromJSDate($event).toFormat('yyyy') : ''
        this.filter.partner_date_created_year = year
        this.fetch(this.filter)
    }

    handleIsOpenChange($event: boolean, pk?: number) {
        const currentIdx = this.partnersList.findIndex((partner) => partner?.pk === pk);
        this.partnersList[currentIdx]['expanded'] = $event;
    }

    handleAddPartner() {
        this.bsModalRef = this.modalService.show(PartnerAddComponent, {
            class: 'modal-xl',
            backdrop: 'static',
            keyboard: false,
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (data?.pk && isSaved) {
                this.partnersList = [data, ...this.partnersList];
                this.changeDetection?.detectChanges();
            }
        });
    }

    onTableSizeChange(event: any) {
        this.tableSize = event.target.value;
        this.page = 1;
        this.fetch();
    }
}
