import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';
import { ProjectFunding, ProjectFundingLiquidation } from '../interfaces/_project.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    constructor(public http: HttpClient) { }

    fetch() {
        return this.http.get(`${_.BASE_URL}/projects`);
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects/${pk}/review`);
    }

    fetchProjectFunding(params: { project_pk?: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${params?.project_pk}/project_funding`);
    }

    saveSignedContractAttachment(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/attachment`, data);
    }

    saveProjectFunding(data: ProjectFunding) {
        return this.http.post(`${_.BASE_URL}/projects/project_funding`, data);
    }

    saveProjectFundingLiquidation(data: ProjectFundingLiquidation) {
        return this.http.post(`${_.BASE_URL}/projects/project_funding_liquidation`, data);
    }

    deleteProjectAttachment(data: any) {
        return this.http.delete(`${_.BASE_URL}/projects/${data.project_pk}/document/${data.document_pk}`, {
            params: { type: data.type },
        });
    }

    destroyReview(pk: number) {
        return this.http.delete(`${_.BASE_URL}/projects/review/${pk}`);
    }

    deleteReviewAttachment(data: any) {
        return this.http.delete(
            `${_.BASE_URL}/projects/${data.project_pk}/review/${data.review_pk}/document/${data.document_pk}`
        );
    }

    saveReview(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/review`, data);
    }

    updateRecommendation(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/recommendation`, data);
    }

    reviews(pk: any, type: string) {
        return this.http.get(`${_.BASE_URL}/projects/${pk}/reviews`, { params: { type } });
    }

    deleteProjectFundingReport(data: {
        project_pk?: number;
        project_funding_pk?: number;
        project_funding_report_pk?: number;
    }) {
        return this.http.delete(
            `${_.BASE_URL}/projects/${data.project_pk}/project_funding/${data.project_funding_pk}/project_funding_report/${data.project_funding_report_pk}`
        );
    }  

    saveLiquidationAttachment(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/liquidation/attachment`, data);
    }

    deleteLiquidationAttachment(data: any) {
        return this.http.delete(`${_.BASE_URL}/documents/${data.pk}`);
    }
}
