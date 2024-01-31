import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Data {
  key: string
  label: string;
}

@Component({
  selector: 'app-input-dropdown',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss']
})
export class InputDropdownComponent {
  @Input() defaultSelected?: string
  @Input() inputValue?: string = ''
  @Input() data: Data[] = []

  @Output() onSelectItem = new EventEmitter<string>()
  @Output() inputValueChange = new EventEmitter<string>()

  selectedItem = ''

  ngOnInit() {
    this.selectedItem = this.defaultSelected ? this.defaultSelected : '';
  }

  onSelectDropdownItem(key: string) {
    this.selectedItem = key
    this.onSelectItem.emit(this.selectedItem)
  }

  onChange(value: number) {
    this.inputValue = String(value) ?? ''
    this.inputValueChange.emit(this.inputValue)
  }
}
