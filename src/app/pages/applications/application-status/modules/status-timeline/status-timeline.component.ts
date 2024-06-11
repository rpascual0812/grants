import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { APPLICATION_TIMELINE_STATUS_DATA_MOCK } from '../../../mocks/application-timeline-status-data.mock';
import { UploadDocumentModalComponent } from '../../../modals/upload-document-modal/upload-document-modal.component';
import { Application } from 'src/app/interfaces/_application.interface';
import { Router } from '@angular/router';

export type Status = 'complete' | 'on-progress' | 'notApproved' | 'approved';

export interface ApplicationStatusButton {
    label: string;
    type: 'info' | 'danger';
    buttonType: 'button' | 'link';
    eventKey: string;
}

export interface ApplicationStatusItem {
    id: string;
    label: string;
    status?: Status;
    button?: ApplicationStatusButton;
}

export interface ApplicationStatusData {
    id: string;
    title: string;
    label?: string;
    button?: ApplicationStatusButton;
    showVerticalLine: boolean;
    status: Status;
    items: ApplicationStatusItem[];
}

@Component({
    selector: 'app-status-timeline',
    templateUrl: './status-timeline.component.html',
    styleUrls: ['./status-timeline.component.scss'],
})
export class StatusTimelineComponent implements OnInit {
    @Input() application: Application | null = {};

    bsModalRef?: BsModalRef;

    timeline: any = [];
    types: any = {
        'grants_team_review': 'Grants Team Review',
        'advisers_review': 'Advisers Review',
        'financial_management_capacity': 'Financial Management Capacity',
        'final_review': 'Due Diligence Final Review',

        'contract_preparation': 'Contract Preparation',
        'final_approval': 'Final Approval',
        'partner_signing': 'Partner Signing',
        'fund_release': 'Fund Release',
        'completed': 'Completed',
    };

    data = APPLICATION_TIMELINE_STATUS_DATA_MOCK as ApplicationStatusData[];

    constructor(private router: Router, private modalService: BsModalService) { }

    ngOnInit() {
        const applicationStatuses = ['Grants Team Review', 'Advisers Review', 'Financial Management Capacity', 'Budget Review and Finalization', 'Due Diligence Final Review', 'Approved'];
        const applicationType = ['grants_team_review', 'advisers_review', 'financial_management_capacity', 'final_review'];
        const projectType = ['contract_preparation', 'final_approval', 'partner_signing', 'fund_release', 'completed'];

        let applicationTimeline = [];
        let grants_application: any = {
            title: 'Grants Application',
            items: [],
            status: 'on-progress',
            showVerticalLine: false
        }

        if (this.application?.status) {
            grants_application.items.push({
                label: 'Complete',
                status: 'complete',
            });

            grants_application.status = 'complete';
            grants_application.showVerticalLine = true;
        }

        applicationTimeline.push(grants_application);

        if (['Received Proposals'].includes(this.application?.status ?? '')) {
            applicationTimeline.push({
                'title': 'On-going Review',
                'items': [],
                'status': 'on-progress',
                'showVerticalLine': false
            });
        }

        let review_and_processing: any = {
            title: 'Reviewing and Processing',
            items: [],
            status: 'on-progress',
            showVerticalLine: true
        }


        if (applicationStatuses.includes(this.application?.status ?? '')) {
            applicationTimeline.push(review_and_processing);

            // get all 'for grantee' reviews
            this.application?.reviews?.filter(review => review.grantee && applicationType.includes(review.type))
                .forEach(review => {
                    const item = {
                        label: this.types[review.type],
                        message: review.message,
                        status: review.needs_resolution ? (review.resolved ? 'complete' : 'on-progress') : 'complete'
                    };
                    review_and_processing.items.push(item);
                });

            let onProgressCount = 0;
            review_and_processing.items.forEach((item: any) => {
                if (item.status == 'on-progress') {
                    onProgressCount++;
                }
            });

            if (review_and_processing.items.length > 0 && onProgressCount == 0) {
                review_and_processing.status = 'complete';
            }

            let grantsApproved: any = {
                title: 'Grants Approved',
                items: [],
                status: this.application?.status == 'Approved' ? 'complete' : 'on-progress',
                showVerticalLine: true
            }

            // check project reviews
            let isCompleted = false;
            this.application?.project?.recommendations?.filter(recommendation => projectType.includes(recommendation.type))
                .forEach(recommendation => {
                    const item = {
                        label: this.types[recommendation.type],
                        message: '',
                        status: 'complete'
                    };
                    grantsApproved.items.push(item);

                    if (recommendation.type == 'completed') {
                        isCompleted = true;
                    }

                    if (this.types[recommendation.type] == 'Fund Release') {
                        this.application?.project?.project_funding?.forEach((fund: any) => {
                            const tranches = {
                                label: fund.title + ' - ' + fund.project_funding_report[fund.project_funding_report.length - 1].status,
                                message: '',
                                status: fund.project_funding_report[fund.project_funding_report.length - 1].status ?? 'none'
                            };
                            grantsApproved.items.push(tranches);
                        });
                    }
                });

            applicationTimeline.push(grantsApproved);

            let completed: any = {
                title: 'Completed',
                items: [],
                status: isCompleted ? 'complete' : 'on-progress',
                showVerticalLine: false
            }
            applicationTimeline.push(completed);
        }

        this.timeline = applicationTimeline;
    }

    getStatusIcon(status: Status) {
        if (status === 'approved' || status === 'complete') {
            return 'done';
        }
        if (status === 'notApproved') {
            return 'close';
        }
        return '';
    }

    handleOnButtonEvent(eventKey?: string) {
        // do something with event key, ex: open a modal
        this.openUploadDocumentModal();
    }

    openUploadDocumentModal() {
        this.bsModalRef = this.modalService.show(UploadDocumentModalComponent);
    }
}
