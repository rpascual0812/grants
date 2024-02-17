import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProponentInformationComponent } from './proponent-information.component';

@NgModule({
    declarations: [ProponentInformationComponent],
    exports: [ProponentInformationComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class ProponentInformationModule { }
