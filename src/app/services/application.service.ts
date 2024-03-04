import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';
@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    public navigate_next = signal(false);
    public navigate_back = signal(false);

    constructor(public http: HttpClient) {}

    fetch(filters?: any) {
        return this.http.get(`${_.BASE_URL}/application`, { params: filters });
    }

    fetchOne(uuid: string) {
        return this.http.get(`${_.BASE_URL}/application/${uuid}`);
    }

    store(data: any) {
        return this.http.post(`${_.BASE_URL}/application`, data);
    }

    destroy(pk: any) {
        return this.http.delete(`${_.BASE_URL}/application/${pk}`);
    }
}
