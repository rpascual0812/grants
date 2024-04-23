import {
    Application,
    Partner,
    ProjectBeneficiary,
    ProjectLocation,
    ProjectProposal,
    Recommendation,
    Review,
    Type,
    Document
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
    project_funding_liquidation?: ProjectFundingLiquidation;
}

export interface ProjectFundingReport {
    pk?: number;
    project_funding_pk?: number;
    title?: string;
    status?: string;
    attachment_pk?: null;
    date_created?: Date;
    archived?: boolean;
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
    documents?: Document[]
}
