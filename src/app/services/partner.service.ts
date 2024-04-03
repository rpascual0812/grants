import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';
@Injectable({
    providedIn: 'root',
})
export class PartnerService {
    constructor(public http: HttpClient) { }

    fetch(filters?: any) {
        return this.http.get(`${_.BASE_URL}/partner`, { params: filters });
    }

    fetchOne(partnerId: string) {
        return this.http.get(`${_.BASE_URL}/partner/${partnerId}`);
    }

    save(data: any) {
        return this.http.post(`${_.BASE_URL}/partner`, data);
    }

    destroy(pk: any) {
        return this.http.delete(`${_.BASE_URL}/partner/${pk}`);
    }

    deleteAttachment(pk: number) {
        return this.http.delete(`${_.BASE_URL}/documents/${pk}`);
    }
}
