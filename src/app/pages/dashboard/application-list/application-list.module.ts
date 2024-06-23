import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationListComponent } from './application-list.component';



@NgModule({
  declarations: [
    ApplicationListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ApplicationListComponent
  ]
})
export class ApplicationListModule { }
