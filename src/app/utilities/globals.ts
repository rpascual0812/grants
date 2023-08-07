import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

'use strict';

export const PRODUCTION: boolean = environment.production;
export const BASE_URL: string = `${environment.api}`;
export const TABLE_SIZES = [10, 20, 30, 40, 50, 100];
export const PAGINATION: object = {
    page: 1,
    count: 0,
    tableSize: 10
};

export function numbersOnly(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
}

export function objectToParams(object: any) {
    let params: any;
    for (var i in object) {
        params = new HttpParams().set(i, object[i]);
    }
    return params;
}

export function errorMessage(message: any) {
    Swal.fire('ERROR', message, 'error');
}

export function successMessage(message: any) {
    Swal.fire('SUCCESS', message, 'success');
}

export function confirmMessage(data: any, callback: Function) {
    Swal.fire({
        title: data.title,
        icon: data.icon,
        showCloseButton: data.buttons.showClose,
        showCancelButton: data.buttons.showCancel,
        focusConfirm: data.buttons.focusConfirm,
        confirmButtonText:
            data.confirmButtonText,
        cancelButtonText:
            data.cancelButtonText,
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    })
}