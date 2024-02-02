import { Component, EventEmitter, Input, Output } from '@angular/core';
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

    @Output() onSelectEvent = new EventEmitter<string | string[]>();

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
        if (this.url.trim() !== '') {
            this.fetch();
        } else {
            this.dropdownList=this.arr
        }
        
    }
    onItemSelect(item: any) {
        console.log(item);
        this.onSelectEvent.emit(item)
    }
    onSelectAll(items: any) {
        console.log(items);
        this.onSelectEvent.emit(items)
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
