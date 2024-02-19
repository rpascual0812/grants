import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-contact-info-references',
    templateUrl: './contact-info-references.component.html',
    styleUrls: ['./contact-info-references.component.scss'],
})
export class ContactInfoReferencesComponent {
    applicationSignalService = inject(ApplicationSignalService);

    handleSave() {
        this.applicationSignalService.submitSave.set(true)
    }

    handleBack() {
        this.applicationSignalService.navigateBack();
    }
}
