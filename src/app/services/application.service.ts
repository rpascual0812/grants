import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    public navigate_next = signal(false);
    public navigate_back = signal(false);

    constructor(
        public http: HttpClient,
    ) { }

    fetch(filters: any) {
        return this.http.get(`${_.BASE_URL}/applications`, { params: filters });
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/applications/${pk}`);
    }

    store(data: any) {
        return this.http.post(`${_.BASE_URL}/applications`, data);
    }

    destroy(pk: any) {
        return this.http.delete(`${_.BASE_URL}/applications/${pk}`);
    }
}