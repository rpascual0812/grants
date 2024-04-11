import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantTabLayoutComponent } from './grant-tab-layout.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
    declarations: [GrantTabLayoutComponent],
    exports: [GrantTabLayoutComponent],
    imports: [CommonModule, TabsModule.forRoot()],
})
export class GrantTabLayoutModule {}
