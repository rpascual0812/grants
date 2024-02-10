import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationAuthComponent } from './application-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ApplicationAuthComponent],
    exports: [ApplicationAuthComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class ApplicationAuthModule {}
