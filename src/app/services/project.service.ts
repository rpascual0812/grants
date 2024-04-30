import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';
import {
    ProjectCapDevKnowledge as ProjectCapDevKnowledge,
    ProjectCapDevObserve,
    ProjectCapDevSkill,
    ProjectFunding,
    ProjectFundingLiquidation,
    ProjectSite,
} from '../interfaces/_project.interface';
import { ProjectBeneficiary } from '../interfaces/_application.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    constructor(public http: HttpClient) {}

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

    fetchProjectSite(data: { pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data.pk}/project_site`);
    }

    saveProjectSite(data: { project_pk?: number; project_site: ProjectSite[] }) {
        return this.http.post(`${_.BASE_URL}/projects/project_site`, data);
    }

    deleteProjectSite(data: { project_pk?: number; project_site_pk: number }) {
        return this.http.delete(`${_.BASE_URL}/projects/${data.project_pk}/project_site/${data.project_site_pk}`);
    }

    updateFinancialManagementTraining(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/update_financial_management_training`, data);
    }

    fetchEvents(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects/${pk}/events`);
    }

    saveEvent(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/${data.project_pk}/events`, data);
    }

    saveAttendee(project_pk: number, data: any) {
        return this.http.post(`${_.BASE_URL}/projects/${project_pk}/events/${data.project_event_pk}/attendee`, data);
    }

    destroyAttendee(data: any) {
        return this.http.delete(`${_.BASE_URL}/projects/attendee/${data.pk}`);
    }

    fetchProjectOutput(data: { pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data.pk}/output`);
    }

    fetchProjectObjectiveResults(data: { pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data.pk}/objective-results`);
    }

    saveProjectObjectiveResults(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/${data.pk}/objective-results`, data.data);
    }

    saveProjectOutput(data: any) {
        return this.http.post(`${_.BASE_URL}/projects/${data.pk}/output`, data.data);
    }

    saveProjectBeneficiary(data: Partial<ProjectBeneficiary>) {
        return this.http.post(`${_.BASE_URL}/projects/project_beneficiary`, data);
    }

    fetchProjectBeneficiary(data: { project_pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data?.project_pk}/project_beneficiary`);
    }

    deleteProjectBeneficiary(data: { project_pk: number; project_beneficiary_pk: number }) {
        return this.http.delete(
            `${_.BASE_URL}/projects/${data?.project_pk}/project_beneficiary/${data?.project_beneficiary_pk}`
        );
    }

    fetchProjectCapDevKnowledge(data: { project_pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_knowledge`);
    }

    saveProjectCapDevKnowledge(data: ProjectCapDevKnowledge) {
        return this.http.post(`${_.BASE_URL}/projects/project_capdev_knowledge`, data);
    }

    deleteProjectCapKnowledge(data: { project_pk: number, pk: number }) {
        return this.http.delete(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_knowledge/${data.pk}`);
    }

    fetchProjectCapDevSkill(data: { project_pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_skill`);
    }

    saveProjectCapDevSkill(data: ProjectCapDevSkill) {
        return this.http.post(`${_.BASE_URL}/projects/project_capdev_skill`, data);
    }

    deleteProjectCapDevSkill(data: { project_pk: number, pk: number }) {
        return this.http.delete(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_skill/${data.pk}`);
    }

    fetchProjectCapDevObserve(data: { project_pk: number }) {
        return this.http.get(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_observe`);
    }

    saveProjectCapDevObserve(data: ProjectCapDevObserve) {
        return this.http.post(`${_.BASE_URL}/projects/project_capdev_observe`, data);
    }

    deleteProjectCapDevObserve(data: { project_pk: number, pk: number }) {
        return this.http.delete(`${_.BASE_URL}/projects/${data?.project_pk}/project_capdev_observe/${data.pk}`);
    }

}
