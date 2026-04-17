import { Component, inject } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../../../../utilities/globals';
import { Router } from '@angular/router';

@Component({
    selector: 'app-partner-danger',
    templateUrl: './partner-danger.component.html',
    styleUrls: ['./partner-danger.component.scss']
})
export class PartnerDangerComponent {
    partnerSignalService = inject(PartnerSignalService);
    partner: PartnerForm | null = null;

    constructor(
        private partnerService: PartnerService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit() {
        this.partner = this.partnerSignalService.partnerForm();
        console.log('danger partner', this.partner?.pk, this.partner);
    }

    delete(): void {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this partner?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.partnerService.destroy(this.partner?.pk).subscribe({
                    next: (data: any) => {
                        let partner = this.partner;
                        if (partner) {
                            partner.archived = true;
                        }
                        this.partnerSignalService.partnerForm.set(partner);
                        this.toastr.success('Partner deleted successfully.');
                        this.router.navigate(['/partners']);
                    },
                    error: (err: HttpErrorResponse) => {
                        const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                        const statusCode = err?.status ? `status: ${err?.status}` : '';
                        this.toastr.error(`Error trying to delete partner. ${statusCode} ${errorMessage} `);
                    },
                });
            }
        );
    }
}
