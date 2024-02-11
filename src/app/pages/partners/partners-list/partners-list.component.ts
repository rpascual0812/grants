import { Component, ViewEncapsulation } from '@angular/core';

interface Partner {
    [key: string]: any;
}

@Component({
    selector: 'app-partners-list',
    templateUrl: './partners-list.component.html',
    styleUrls: ['./partners-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PartnersListComponent {
    oneAtATime = true;
    partnersList: Partner[] = [];
    page: number = 1;
    constructor() {
        for (let i = 1; i <= 100; i++) {
            this.partnersList.push({
                id: `${i}${new Date().getTime().toString()}`,
                partner: `Partner ${i}`,
                location: `${i}, C, Medicion 2-F, Imus, Cavite, Philippines`,
                totalGrantAmount: `1000`,
                expanded: false,
                info: [
                    {
                        grantTitle: `Grant Title Sample with super long name`,
                        amount: `10000`,
                        status: `Preparing for project start up`,
                        donorProject: `Global Green grants`,
                    },
                ],
            });
        }
    }

    handleIsOpenChange($event: boolean, id: string) {
        const currentIdx = this.partnersList.findIndex((partner) => partner['id'] === id);
        this.partnersList[currentIdx]['expanded'] = $event;
    }

    handlePageChange($event: number) {
        this.page = $event;
    }
}
