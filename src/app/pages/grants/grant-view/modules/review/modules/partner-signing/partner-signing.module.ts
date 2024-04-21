import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PartnerSigningComponent } from './partner-signing.component';

@NgModule({
    declarations: [
        PartnerSigningComponent
    ],
    exports: [PartnerSigningComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class PartnerSigningModule { }
