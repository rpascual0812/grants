import {
    Application,
    Partner,
    ProjectBeneficiary,
    ProjectLocation,
    ProjectAssessment,
    ProjectProposal,
    Recommendation,
    Review,
    Type,
    Document,
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
    overall_grant_status: string;
    closing_status: string;
    pending_document: string;
    project_proposal?: ProjectProposal;
    project_beneficiary?: ProjectBeneficiary;
    project_location?: ProjectLocation[];
    project_assessment?: ProjectAssessment[];
    project_funding?: ProjectFunding[];
    recommendations?: Recommendation[];
    partner_pk?: number;
    partner?: Partner;
    type?: Type;
    reviews: Review[];
    documents?: Document[];
}

export interface ProjectFunding {
    pk?: number;
    donor?: Donor;
    title?: string;
    project_pk?: number;
    released_amount_usd?: string;
    released_amount_other?: string;
    released_amount_other_currency?: string;
    released_date?: Date;
    bank_receipt_pk?: number;
    bank_receipt_document?: Document;
    grantee_acknowledgement?: Date;
    created_by?: number;
    report_due_date?: Date;
    date_created?: Date;
    date_updated?: Date;
    project_funding_report?: ProjectFundingReport[];
    project_funding_liquidation?: ProjectFundingLiquidation[];
}

export interface Donor {
    pk?: number;
    name: string;
    code: string;
    active: boolean;
    created_by?: number;
    date_created?: Date;
    date_updated?: Date;
    archived?: boolean;
}

export interface ProjectFundingReport {
    pk?: number;
    project_funding_pk?: number;
    title?: string;
    status?: string;
    attachment_pk?: number;
    date_created?: Date;
    archived?: boolean;
    document?: Document;
}

export interface ProjectFundingLiquidation {
    pk?: number;
    project_funding_pk?: number;
    description?: string;
    amount_usd?: string;
    amount_other?: string;
    amount_other_currency?: string;
    status?: string;
    date_created?: Date;
    date_released?: Date;
    documents?: Document[];
}

export interface ProjectSite {
    pk?: number;
    project_pk?: number;
    site?: string;
    created_by?: number;
    date_created?: Date;
}

export interface ProjectCapDevKnowledge {
    project_pk?: number;
    created_by?: number;
    knowledge?: string;
    instruction?: string;
    remarks?: string;
    pk?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface ProjectCapDevSkill {
    pk?: number;
    project_pk?: number;
    skill_gained?: string;
    instruction?: string;
    skill?: string;
    remarks?: string;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface ProjectCapDevObserve {
    pk?: number;
    project_pk?: number;
    observed?: string;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface ProjectLesson {
    project_pk?: number;
    created_by?: number;
    type?: string;
    type_content?: string;
    description?: string;
    pk?: number;
    date_created?: Date;
    date_updated?: Date;
    archived?: boolean;
}

export interface ProjectCode {
    pk?: number;
    project_pk?: number;
    project_funding_pk?: number;
    donor_code?: string;
    code?: string;
    created_by?: number;
    date_created?: Date;
}
