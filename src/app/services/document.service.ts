import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';
@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(public http: HttpClient) { }

    fetch(filters?: any) {
        return this.http.get(`${_.BASE_URL}/documents`, { params: filters });
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/documents/${pk}`);
    }

    save(data: any) {
        return this.http.post(`${_.BASE_URL}/documents/documentable`, data);
    }

    destroy(pk: any) {
        return this.http.delete(`${_.BASE_URL}/documents/${pk}`);
    }
}
