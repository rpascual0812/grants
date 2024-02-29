import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
    @Input() url: string = '';
    @Input() listItemKey: string = 'pk';
    @Input() placeholder: string = '';
    @Input() arr: any = [];
    @Input() multiple: boolean = false;
    @Input() limitSelection: any = -1;
    @Input() itemsShowLimit: any = 1;
    @Input() disabled: boolean = false;
    @Input() defaultSelectedItemKey?: any; // default selected with pk in list and url is indicated
    @Input() defaultSelectedInArr?: any; // default selected without pk in list and url is NOT indicated
    @Output() onSelectEvent = new EventEmitter<string | string[] | any>();
    @Output() onDeSelectEvent = new EventEmitter<any>();

    loading: boolean = false;
    dropdownList: any = [];
    selectedItems: any = [];
    dropdownSettings = {};

    constructor(private globalService: GlobalService) {}

    ngOnInit() {
        this.selectedItems = [];

        this.dropdownSettings = {
            singleSelection: !this.multiple,
            idField: this.listItemKey,
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: this.itemsShowLimit,
            allowSearchFilter: true,
            clearSearchFilter: true,
            limitSelection: this.limitSelection,
        };

        if (this.url.trim() !== '') {
            this.fetch();
        } else {
            this.dropdownList = this.arr;
            this.selectedItems = this.arr.filter((item: any) => item === this.defaultSelectedInArr);
            this.setDefaultSelectedItemKey(this.arr)
        }
    }

    onItemSelect(item: any) {
        this.selectedItems = [item];
        this.onSelectEvent.emit(this.selectedItems);
    }

    onSelectAll(items: any) {
        this.selectedItems = [...items];
        this.onSelectEvent.emit(this.selectedItems);
    }

    onDeselect(item: any) {
        this.selectedItems = this.selectedItems.filter((selectedItem: any) => selectedItem !== item);
        this.onDeSelectEvent.emit(this.selectedItems);
    }

    fetch() {
        this.globalService.selectFetch(this.url).subscribe({
            next: (data: any) => {
                this.dropdownList = data.data;
                this.setDefaultSelectedItemKey(data.data);
            },
            error: (error: any) => {
                console.log(error);
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            },
            complete: () => {
                console.log('Complete');
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            },
        });
    }

    setDefaultSelectedItemKey(dropdownList: any[]) {
        if (this.defaultSelectedItemKey) {
            this.selectedItems = dropdownList?.filter(
                (item: any) => item[this.listItemKey] === this.defaultSelectedItemKey
            );
        }
    }
}
