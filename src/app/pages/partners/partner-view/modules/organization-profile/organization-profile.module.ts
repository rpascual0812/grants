import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationProfileComponent } from './organization-profile.component';

@NgModule({
    declarations: [OrganizationProfileComponent],
    exports: [OrganizationProfileComponent],
    imports: [CommonModule],
})
export class OrganizationProfileModule {}
