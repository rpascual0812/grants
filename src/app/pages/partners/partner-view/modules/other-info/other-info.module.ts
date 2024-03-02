import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherInfoComponent } from './other-info.component';
import { SelectModule } from 'src/app/components/select/select.module';

@NgModule({
    declarations: [OtherInfoComponent],
    exports: [OtherInfoComponent],
    imports: [CommonModule, SelectModule],
})
export class OtherInfoModule {}
