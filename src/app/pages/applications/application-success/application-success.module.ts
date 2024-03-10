import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationSuccessComponent } from './application-success.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ApplicationSuccessComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ApplicationSuccessModule { }
