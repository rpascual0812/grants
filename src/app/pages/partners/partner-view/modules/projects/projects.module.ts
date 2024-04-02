import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ProjectsComponent],
    exports: [ProjectsComponent],
    imports: [CommonModule, ReactiveFormsModule],
})
export class ProjectsModule {}
