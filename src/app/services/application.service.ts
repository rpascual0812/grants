import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';
import { ApplicationFiscalSponsor, Organization, Partner } from '../interfaces/_application.interface';
import { ApplicationNonprofitEquivalencyDeterminationRead } from '../interfaces/application.interface';
@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    public navigate_next = signal(false);
    public navigate_back = signal(false);

    constructor(public http: HttpClient) { }

    fetch(filters?: any) {
        return this.http.get(`${_.BASE_URL}/application`, { params: filters });
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/application/${pk}`);
    }

    generated(uuid: string) {
        return this.http.get(`${_.BASE_URL}/application/${uuid}/generated`);
    }

    review(number: any) {
        return this.http.get(`${_.BASE_URL}/application/${number}/review`);
    }

    generate(data: any) {
        return this.http.post(`${_.BASE_URL}/application/generate`, data);
    }

    store(data: any) {
        return this.http.post(`${_.BASE_URL}/application`, data);
    }

    saveApplicationPartner(data: Partner) {
        return this.http.post(`${_.BASE_URL}/application/partner`, data);
    }

    saveApplicationPartnerOrg(data: Organization) {
        return this.http.post(`${_.BASE_URL}/application/partner_organization`, data);
    }

    saveApplicationFiscalSponsor(data: ApplicationFiscalSponsor) {
        return this.http.post(`${_.BASE_URL}/application/fiscal_sponsor`, data);
    }

    saveApplicationNonProfitEquivalencyDetermination(data: ApplicationNonprofitEquivalencyDeterminationRead) {
        return this.http.post(`${_.BASE_URL}/application/nonprofit_equivalency_determination`, data);
    }

    destroy(pk: any) {
        return this.http.delete(`${_.BASE_URL}/application/${pk}`);
    }

    saveReview(data: any) {
        return this.http.post(`${_.BASE_URL}/application/review`, data);
    }

    saveMediumGrantsAttachment(data: any) {
        return this.http.post(`${_.BASE_URL}/application/attachment`, data);
    }

    destroyReview(pk: number) {
        return this.http.delete(`${_.BASE_URL}/application/review/${pk}`);
    }

    updateRecommendation(data: any) {
        return this.http.post(`${_.BASE_URL}/application/recommendation`, data);
    }
}
