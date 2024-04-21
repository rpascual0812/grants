import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(public http: HttpClient) { }

    fetch(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects`);
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects/${pk}/review`);
    }

    saveSignedContractAttachment(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/attachment`, data);
    }

    deleteProjectAttachment(data: any) {
        return this.http.delete(`${_.BASE_URL}/projects/${data.project_pk}/document/${data.document_pk}`, {
            params: { type: data.type },
        });
    }
}
