import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediumGrantsComponent } from './medium-grants.component';



@NgModule({
  declarations: [
    MediumGrantsComponent
  ],
  exports: [
    MediumGrantsComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class MediumGrantsModule { }
