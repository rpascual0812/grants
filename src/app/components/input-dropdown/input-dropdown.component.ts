import { Component, EventEmitter, Input, Output } from '@angular/core';

type SelectedDropdownItem = {
    key: string;
    label: string;
};

export interface InputDropdownValue {
    value: string | number;
    selectedItem?: SelectedDropdownItem;
}

@Component({
    selector: 'app-input-dropdown',
    templateUrl: './input-dropdown.component.html',
    styleUrls: ['./input-dropdown.component.scss'],
})
export class InputDropdownComponent {
    @Input() disabledDropdown: boolean = false;
    @Input() defaultSelected?: string;
    @Input() inputValue?: string = '';
    @Input() data: SelectedDropdownItem[] = [];

    @Output() onSelectItem = new EventEmitter<string>();
    @Output() inputValueChange = new EventEmitter<InputDropdownValue>();

    selectedItem = '';

    ngOnInit() {
        this.selectedItem = this.defaultSelected ? this.defaultSelected : '';
    }

    onSelectDropdownItem(key: string) {
        this.selectedItem = key;
        this.inputValue = '';
        this.onSelectItem.emit(this.selectedItem);
    }

    onChange(value: number) {
        this.inputValueChange.emit({
            value,
            selectedItem: this.data.filter((val) => val.key === this.selectedItem)?.at(0),
        });
    }
}
