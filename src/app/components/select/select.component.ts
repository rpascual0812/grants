import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { GlobalService } from '../../services/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface ChangeFieldEventEmitter {
    selectedItems?: any[];
    arr?: any[];
    key?: string;
}

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
    @Input() key: string = '';
    @Input() url: string = '';
    @Input() listItemKey: string = 'pk';
    @Input() listItemValue: string = 'name';
    @Input() placeholder: string = '';
    @Input() arr: any = [];
    @Input() multiple: boolean = false;
    @Input() limitSelection: any = -1;
    @Input() itemsShowLimit: any = 1;
    @Input() disabled: boolean = false;
    @Input() indexZero: any = {};
    @Input() defaultSelectedItemKey?: any; // default selected with pk in list and url is indicated
    @Input() defaultSelectedItemKeyArr?: any; // default selected with pk in list and url is indicated
    @Input() defaultSelectedInArr?: any; // default selected without pk in list and url is NOT indicated
    @Input() changeFieldEventEmitter?: EventEmitter<ChangeFieldEventEmitter>;

    @Output() onSelectEvent = new EventEmitter<string | string[] | any>();
    @Output() onDeSelectEvent = new EventEmitter<any>();

    loading: boolean = false;
    dropdownList: any = [];
    selectedItems: any = [];
    dropdownSettings = {};

    form: FormGroup;

    constructor(private globalService: GlobalService, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.subscribeToChangeFieldEmitter();
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
            this.setDefaultSelectedItemKey();
        }

        this.form = this.formBuilder.group({
            selections: ['']
        });
    }

    onItemSelect(item: any) {
        if (this.multiple) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems = [item];
        }
        this.onSelectEvent.emit(this.selectedItems);
    }

    onSelectAll(items: any) {
        this.selectedItems = [...items];
        this.onSelectEvent.emit(this.selectedItems);
    }

    onDeselect(item: any) {
        this.selectedItems = this.selectedItems.filter((selectedItem: any) => selectedItem.pk !== item.pk);
        this.onDeSelectEvent.emit(this.selectedItems);
    }

    fetch() {
        this.globalService.selectFetch(this.url).subscribe({
            next: (data: any) => {
                this.dropdownList = data.data;
                this.setDefaultSelectedItemKey();
            },
            error: (error: any) => {
                console.log(error);
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            },
            complete: () => {
                if (Object.keys(this.indexZero).length > 0) {
                    this.dropdownList.unshift(this.indexZero);
                }
                console.log('Complete');
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            },
        });
    }

    setDefaultSelectedItemKey() {
        if (this.multiple) {
            if (this.defaultSelectedItemKeyArr.length > 0) {
                this.dropdownList.forEach((item: any) => {
                    this.defaultSelectedItemKeyArr.forEach((selected: any) => {
                        if (item.pk == selected.pk) {
                            this.selectedItems.push({ pk: selected.pk, name: item.name });
                        }
                    });
                });
            }
        }
        else {
            if (this.defaultSelectedItemKey) {
                this.selectedItems = this.dropdownList?.filter(
                    (item: any) => item[this.listItemKey] === this.defaultSelectedItemKey
                );
            }
        }

        this.form.get('selections')?.patchValue(this.selectedItems);
        this.cdRef.detectChanges();
    }

    subscribeToChangeFieldEmitter() {
        this.changeFieldEventEmitter &&
            this.changeFieldEventEmitter.subscribe((data: ChangeFieldEventEmitter) => {
                let tmpKey = data?.key ?? '';
                if (tmpKey === this.key) {
                    if (data?.selectedItems) {
                        this.selectedItems = data.selectedItems;
                    }

                    if (data?.arr) {
                        this.arr = data.arr;
                        this.dropdownList = this.arr;
                    }
                }
            });
    }

    reset() {
        this.selectedItems = [];
    }
}
