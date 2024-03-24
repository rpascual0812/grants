import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsTeamReviewComponent } from './grants-team-review.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        GrantsTeamReviewComponent
    ],
    exports: [
        GrantsTeamReviewComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
    ]
})
export class GrantsTeamReviewModule { }
