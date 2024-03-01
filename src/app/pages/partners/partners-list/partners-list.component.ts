import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerRead } from 'src/app/interfaces/application.interface';
import { PartnerService } from 'src/app/services/partner.service';

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
    loading = false;
    oneAtATime = true;
    partnersList: Partner[] = [];
    page: number = 1;
    constructor(private partnerService: PartnerService) {}

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.partnerService.fetch().subscribe({
            next: (response: any) => {
                const data: PartnerRead[] = response?.data ?? [];
                this.partnersList = data.map((item, idx: number) => ({
                    partner: item?.name ?? '',
                    id: item?.partner_id,
                    location: `${idx + 1}, C, Medicion 2-F, Imus, Cavite, Philippines`,
                    totalGrantAmount: `10000`,
                    expanded: false,
                    info: [
                        {
                            grantTitle: `Grant Title Sample with super long name`,
                            amount: `10000`,
                            status: `Preparing for project start up`,
                            donorProject: `Global Green grants`,
                        },
                    ],
                }));
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            },
        });
    }

    handleIsOpenChange($event: boolean, id: string) {
        const currentIdx = this.partnersList.findIndex((partner) => partner['id'] === id);
        this.partnersList[currentIdx]['expanded'] = $event;
    }

    handlePageChange($event: number) {
        this.page = $event;
    }
}
