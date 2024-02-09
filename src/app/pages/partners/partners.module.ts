import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { PartnersListModule } from './partners-list/partners-list.module';

@NgModule({
  declarations: [
    PartnersComponent
  ],
  imports: [
    CommonModule,
    PartnersListModule
  ]
})
export class PartnersModule { }
