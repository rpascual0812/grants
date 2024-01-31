import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';



@NgModule({
  declarations: [
    ApplicationsComponent,
    ApplicationStatusComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ApplicationsModule { }
