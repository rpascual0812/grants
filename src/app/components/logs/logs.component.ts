import { Component, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { LogService } from 'src/app/services/log.service';

import * as _ from '../../utilities/globals';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
    public callback: EventEmitter<any> = new EventEmitter();

    title?: string;
    module?: any;
    loading: boolean = false;
    closeBtnName?: string;

    logs: any = [];

    filters: any = {};

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(
        public bsModalRef: BsModalRef,
        private logService: LogService
    ) { }

    ngOnInit(): void {
        this.filters = {
            entity: this.module.entity,
            pk: this.module.pk,
            skip: 0,
            take: this.pagination.tableSize
        };

        this.fetch();
    }

    fetch() {
        this.logService
            .fetch(this.filters)
            .subscribe({
                next: (data: any) => {
                    data.forEach((log: any) => {
                        log.date_formatted = DateTime.fromISO(log.date_created).toFormat('LLLL dd, yyyy hh:mm:ss a');
                    });

                    this.logs = data;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    onTableDataChange(event: any) {
        this.pagination.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.pagination.tableSize = event.target.value;
        this.pagination.page = 1;
        this.fetch();
    }
}
