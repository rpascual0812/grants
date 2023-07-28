import { AbstractControl, FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function MustValid(controlName: string, service: any) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if (control.errors && !control.errors['MustValid']) {
            // return if another validator has already found an error on the control
            return;
        }

        //set timeout for now to make sure the user is already done typing
        setTimeout(() => {
            // set error on control if validation fails
            service.checkEmail(control.value)
                .then((data: any) => {
                    if (data.status) {
                        control.setErrors(null);
                    }
                    else {
                        control.setErrors({ MustValid: true });
                    }
                })
                .catch((err: any) => {
                    control.setErrors(null);
                });
        }, 1000);
    }
}

export function ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
        return { invalidUrl: true };
    }
    return null;
}