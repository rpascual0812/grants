import {
    Application,
    Partner,
    ProjectBeneficiary,
    ProjectLocation,
    ProjectProposal,
    Recommendation,
    Review,
    Type,
} from './_application.interface';

export interface Project {
    pk?: number;
    application_pk?: number;
    application?: Application;
    title?: string;
    duration?: string;
    background?: string;
    objective?: string;
    expected_output?: string;
    how_will_affect?: string;
    status?: string;
    type_pk?: number;
    financial_management_training?: boolean;
    date_created?: Date;
    project_proposal?: ProjectProposal;
    project_beneficiary?: ProjectBeneficiary[];
    project_location?: ProjectLocation[];
    recommendations?: Recommendation[];
    partner_pk: number;
    partner?: Partner;
    type?: Type;
    reviews: Review[];
}


export interface ProjectFunding {
    pk?: number;
    title?: string;
    project_pk?: number;
    released_amount?: string;
    released_date?: Date;
    bank_receipt_pk?: number;
    grantee_acknowledgement_pk?: number;
    created_by?: number;
    report_due_date?: Date;
    date_created?: Date;
    date_updated?: Date;
    project_funding_report?: ProjectFundingReport[];
}

export interface ProjectFundingReport {
    pk?: number;
    project_funding_pk?: number;
    title?: string;
    status?: string;
    date_created?: Date;
    archived?: boolean;
}
