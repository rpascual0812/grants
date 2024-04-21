import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FundReleaseComponent } from './fund-release.component';

@NgModule({
    declarations: [
        FundReleaseComponent
    ],
    exports: [FundReleaseComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class FundReleaseModule { }
