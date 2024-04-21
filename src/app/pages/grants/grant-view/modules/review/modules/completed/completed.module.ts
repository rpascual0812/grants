import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompletedComponent } from './completed.component';

@NgModule({
    declarations: [
        CompletedComponent
    ],
    exports: [CompletedComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class CompletedModule { }
