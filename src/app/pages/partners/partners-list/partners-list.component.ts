import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerRead } from 'src/app/interfaces/application.interface';
import { PartnerService } from 'src/app/services/partner.service';
import * as _ from '../../../utilities/globals';
import { GRANT_TYPES, THEMATIC_AREAS } from 'src/app/utilities/constants';

type SelectItem = {
    pk: number;
    name: string;
};

type Filter = {
    organization_pk: number | null;
};

interface Partner {
    [key: string]: any;
}

@Component({
    selector: 'app-partners-list',
    templateUrl: './partners-list.component.html',
    styleUrls: ['./partners-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PartnersListComponent implements OnInit {
    tableSizes: any = _.TABLE_SIZES;
    grantTypes = GRANT_TYPES
    thematicAreas = THEMATIC_AREAS

    loading = false;
    oneAtATime = true;
    partnersList: Partner[] = [];

    page: number = 1;
    tableSize: number = 10

    filter: Filter = {
        organization_pk: null,
    };

    constructor(private partnerService: PartnerService) { }

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
                    const data: PartnerRead[] = response?.data ?? [];
                    this.partnersList = data.map((item, idx: number) => ({
                        partner: item?.name ?? '',
                        id: item?.partner_id,
                        location: item.address,
                        grand_total_amount: item.grand_total_amount,
                        expanded: false,
                        applications: item?.application?.filter((app) => !!app?.project?.title),
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
        this.filter[key as keyof typeof this.filter] = pk;
        this.fetch(this.filter);
    }

    handleIsOpenChange($event: boolean, id: string) {
        const currentIdx = this.partnersList.findIndex((partner) => partner['id'] === id);
        this.partnersList[currentIdx]['expanded'] = $event;
    }


    onTableSizeChange(event: any) {
        this.tableSize = event.target.value;
        this.page = 1;
        this.fetch();
    }
}
