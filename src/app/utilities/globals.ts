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

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const RESTRICTIONS: any = {
    restricted: 0,
    'read-only': 1,
    comments: 2,
    recommendation: 3,
    edit: 4
}

export const PERMISSIONS: any = {
    grant_application: 'restricted',
    contract_finalization: 'restricted',
    fund_release: 'restricted',
}

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

// This is inputs inside a modal
export function onFocus(element: any) {
    element.parentNode.classList.add("is-focused");
}

export function onExit(element: any) {
    element.parentNode.classList.remove("is-focused");
    if (element.value !== '') {
        element.parentNode.classList.add("is-filled");
    }
}

export function exportFile(mimetype: string, filename: string, content: string) {
    var data = new Blob([content], { type: mimetype });
    let url = window.URL.createObjectURL(data);
    let a = document.createElement('a');
    document.body.appendChild(a);

    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename ? filename : 'file.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

export function download(doc: any) {
    var link = document.createElement("a");
    link.target = "_blank";
    link.download = doc.original_name;
    link.href = `${environment.api}/${doc.path}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}