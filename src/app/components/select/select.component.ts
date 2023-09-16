import { Component, Input } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { GlobalService } from "../../services/global.service";

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss']
})
export class SelectComponent {
    @Input() url: String = '';
    @Input() placeholder: string = '';
    @Input() arr: any = [];
    @Input() multiple: boolean = false;
    @Input() limitSelection: any = -1;
    @Input() itemsShowLimit: any = 1;

    loading: boolean = false;
    dropdownList: any = [];
    selectedItems: any = [];
    dropdownSettings = {};

    constructor(
        private globalService: GlobalService
    ) {

    }

    ngOnInit() {
        this.selectedItems = [];
        this.dropdownSettings = {
            singleSelection: !this.multiple,
            idField: 'pk',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: this.itemsShowLimit,
            allowSearchFilter: true,
            clearSearchFilter: true,
            limitSelection: this.limitSelection
        };

        this.fetch();
    }
    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }

    fetch() {
        this.globalService
            .selectFetch(this.url)
            .subscribe({
                next: (data: any) => {
                    this.dropdownList = data.data;
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }
}
