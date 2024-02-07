import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { ApplicationStatusModule } from './application-status/application-status.module';
import { ApplicationDetailModule } from './application-detail/application-detail.module';

@NgModule({
    declarations: [PublicComponent],
    exports: [PublicComponent],
    imports: [CommonModule, ApplicationStatusModule, ApplicationDetailModule],
})
export class PublicModule {}
