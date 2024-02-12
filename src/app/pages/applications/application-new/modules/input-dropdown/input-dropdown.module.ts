import { EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDropdownComponent } from './input-dropdown.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputDropdownComponent],
  exports: [InputDropdownComponent],
  imports: [CommonModule, FormsModule],
})
export class InputDropdownModule {}
