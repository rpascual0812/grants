import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import Swal from 'sweetalert2';

'use strict';

export const PRODUCTION: boolean = environment.production;
export const BASE_URL: string = `${environment.api}`;
export const TABLE_SIZES = [10, 20, 30, 40, 50, 100];

export function numbersOnly(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
}

export const YEARS = () => {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().subtract(100, 'y');

    while (dateEnd.diff(dateStart, 'years') != 0) {
        years.push(dateStart.format('YYYY'));
        dateStart.subtract(1, 'year');
    }
    return years;
}

export const MONTHS = () => {
    const months = [];
    const dateStart = moment();
    const dateEnd = moment().add(12, 'month');

    while (dateEnd.diff(dateStart, 'months') > 0) {
        months.push(("0" + dateStart.format('M')).slice(-2));
        dateStart.add(1, 'month');
    }
    return months;
}

export const DAYS = (year: any, month: any) => {
    const days = [];
    month = month ? month : '01';
    year = year ? year : moment().format('YYYY');
    const dateStart = moment(year + '-' + month, 'YYYY-MM');
    const dateEnd = moment(year + '-' + month, 'YYYY-MM').add(dateStart.daysInMonth(), 'days');
    while (dateEnd.diff(dateStart, 'days') > 0) {
        days.push(("0" + dateStart.format('D')).slice(-2));
        dateStart.add(1, 'days');
    }
    return days;
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