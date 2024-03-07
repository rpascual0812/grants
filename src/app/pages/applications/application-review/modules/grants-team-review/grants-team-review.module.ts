import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsTeamReviewComponent } from './grants-team-review.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    GrantsTeamReviewComponent
  ],
  exports: [
    GrantsTeamReviewComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
  ]
})
export class GrantsTeamReviewModule { }
