import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ProjectsComponent],
    exports: [ProjectsComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ProjectsModule {}
