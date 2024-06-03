import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';
import { PartnerAssessment } from '../interfaces/_application.interface';
@Injectable({
    providedIn: 'root',
})
export class PartnerService {
    constructor(public http: HttpClient) {}

    fetch(filters?: any) {
        return this.http.get(`${_.BASE_URL}/partner`, { params: filters });
    }

    fetchOne(partnerId: string) {
        return this.http.get(`${_.BASE_URL}/partner/${partnerId}`);
    }

    fetchPartnerAssessments(partnerPk?: number) {
        return this.http.get(`${_.BASE_URL}/partner/${partnerPk}/assessment`);
    }

    savePartnerAssessment(data: PartnerAssessment) {
        return this.http.post(`${_.BASE_URL}/partner/assessment`, data);
    }

    deletePartnerAssessment(partnerPk?: number, partnerAssessmentPk?: number) {
        return this.http.delete(`${_.BASE_URL}/partner/${partnerPk}/assessment/${partnerAssessmentPk}`);
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
