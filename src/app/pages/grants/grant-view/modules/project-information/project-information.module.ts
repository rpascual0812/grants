import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInformationComponent } from './project-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
  declarations: [
    ProjectInformationComponent
  ],
  exports: [
    ProjectInformationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule
  ]
})
export class ProjectInformationModule { }
