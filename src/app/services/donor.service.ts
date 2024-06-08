import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class DonorService {

    constructor(
        public http: HttpClient,
    ) { }

    fetch(filters: any) {
        return this.http.get(`${_.BASE_URL}/donors`, { params: filters });
    }

    save(donor: any) {
        return this.http.post(`${_.BASE_URL}/donors`, donor);
    }

    suspend(pk: any, data: any) {
        return this.http.post(`${_.BASE_URL}/donors/${pk}`, data);
    }

    fetchAll(filters: any) {
        return this.http.get(`${_.BASE_URL}/donors`, { params: filters });
    }
}
