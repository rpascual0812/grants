import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutComponent } from './public-layout.component';
import { PublicModule } from 'src/app/pages/public/public.module';

@NgModule({
    declarations: [PublicLayoutComponent],
    imports: [CommonModule, PublicModule],
})
export class PublicLayoutModule {}
