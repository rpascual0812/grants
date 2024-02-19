import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
    @Input() url: String = '';
    @Input() placeholder: string = '';
    @Input() arr: any = [];
    @Input() multiple: boolean = false;
    @Input() limitSelection: any = -1;
    @Input() itemsShowLimit: any = 1;
    @Input() defaultSelectedPk?: number;

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
            idField: 'pk',
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
        }
    }

    onItemSelect(item: any) {
        console.log(item, 'onItemSelect');
        this.selectedItems = [item];
        this.onSelectEvent.emit(this.selectedItems);
    }

    onSelectAll(items: any) {
        console.log(items, 'onSelectAll');
        this.selectedItems = [...items];
        this.onSelectEvent.emit(this.selectedItems);
    }

    onDeselect(item: any) {
        console.log(item, 'onDeselect');
        this.selectedItems = this.selectedItems.filter((selectedItem: any) => selectedItem !== item);
        this.onDeSelectEvent.emit(this.selectedItems);
    }

    fetch() {
        this.globalService.selectFetch(this.url).subscribe({
            next: (data: any) => {
                this.dropdownList = data.data;
                this.setDefaultSelectedPk(data.data);
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

    setDefaultSelectedPk(dropdownList: any[]) {
        if (this.defaultSelectedPk) {
            this.selectedItems = dropdownList?.filter((item: any) => item.pk === this.defaultSelectedPk);
        }
    }
}
