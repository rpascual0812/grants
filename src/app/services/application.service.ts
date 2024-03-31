import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';
import {
    PartnerFiscalSponsor,
    ProjectProposal,
    ProjectOrganizationReference,
    Organization,
    Partner,
    Project,
} from '../interfaces/_application.interface';
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

    review(number: any) { // this is the application review page
        return this.http.get(`${_.BASE_URL}/application/${number}/review`, { params: { reviews: true } });
    }

    reviews(pk: any, type: string) { // this is the reviews of each applications
        return this.http.get(`${_.BASE_URL}/application/${pk}/reviews`, { params: { type } });
    }

    generate(data: any) {
        return this.http.post(`${_.BASE_URL}/application/generate`, data);
    }

    store(data: any) {
        return this.http.post(`${_.BASE_URL}/application`, data);
    }

    saveApplicationAttachment(data: any) {
        return this.http.post(`${_.BASE_URL}/application/attachment`, data);
    }

    saveApplicationPartner(data: Partner) {
        return this.http.post(`${_.BASE_URL}/application/partner`, data);
    }

    saveApplicationPartnerOrg(data: Organization) {
        return this.http.post(`${_.BASE_URL}/application/partner_organization`, data);
    }

    saveApplicationFiscalSponsor(data: PartnerFiscalSponsor) {
        return this.http.post(`${_.BASE_URL}/application/fiscal_sponsor`, data);
    }

    saveApplicationNonProfitEquivalencyDetermination(data: ApplicationNonprofitEquivalencyDeterminationRead) {
        return this.http.post(`${_.BASE_URL}/application/nonprofit_equivalency_determination`, data);
    }

    saveApplicationProject(data: Project) {
        return this.http.post(`${_.BASE_URL}/application/project`, data);
    }

    saveApplicationProposal(data: ProjectProposal) {
        return this.http.post(`${_.BASE_URL}/application/proposal`, data);
    }

    saveAppReference(data: {
        partner_organization_pk?: number,
        partner_organization_reference: ProjectOrganizationReference[]
    }) {
        return this.http.post(`${_.BASE_URL}/application/reference`, data);
    }

    deleteAppProposalAct(params: { proposalPk: number; activityPk: number }) {
        const { proposalPk, activityPk } = params;
        return this.http.delete(`${_.BASE_URL}/application/proposal/${proposalPk}/activity/${activityPk}`);
    }

    deleteAppProjLoc(params: { projectPk: number; locationPk: number }) {
        const { projectPk, locationPk } = params;
        return this.http.delete(`${_.BASE_URL}/application/project/${projectPk}/location/${locationPk}`);
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

    resolveReview(data: any) {
        return this.http.post(`${_.BASE_URL}/application/${data.application_pk}/review/${data.review_pk}/resolve`, data);
    }

    deleteApplicationAttachment(data: any) {
        return this.http.delete(`${_.BASE_URL}/application/${data.application_pk}/document/${data.document_pk}`, { params: { type: data.type } });
    }

    deleteReviewAttachment(data: any) {
        return this.http.delete(`${_.BASE_URL}/application/${data.application_pk}/review/${data.review_pk}/document/${data.document_pk}`);
    }

    sendSuccessEmail(pk: any) {
        return this.http.post(`${_.BASE_URL}/application/${pk}/success/email`, {});
    }
}
