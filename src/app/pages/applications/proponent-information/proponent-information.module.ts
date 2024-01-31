import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProponentInformationComponent } from './proponent-information.component';

@NgModule({
  declarations: [ProponentInformationComponent],
  exports: [ProponentInformationComponent],
  imports: [CommonModule],
})
export class ProponentInformationModule {}
