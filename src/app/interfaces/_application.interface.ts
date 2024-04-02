// TODO: please use this for the new application save
export interface Application {
    pk?: number;
    uuid?: string;
    number?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    status_pk?: number;
    archived?: boolean;
    partner?: Partner;
    project?: Project;
    application_nonprofit_equivalency_determination?: ApplicationNonProfitEquivalencyDetermination;
    reviews?: Review[];
    documents?: Document[];
    recommendations?: Recommendation[];
}

export interface Partner {
    pk?: number;
    partner_id?: string;
    name?: string;
    address?: string;
    contact_number?: string;
    email_address?: string;
    website?: string;
    date_created?: Date;
    archived?: boolean;
    organization?: Organization;
    partner_fiscal_sponsor?: PartnerFiscalSponsor;
    contacts?: Contact[];
    projects?: Project[];
    documents?: []
}

export interface Contact {
    pk?: number;
    partner_pk?: number;
    name?: string;
    contact_number?: string;
    email_address?: string;
    date_created?: Date;
}

export interface Organization {
    pk?: number;
    partner_pk?: number;
    organization_pk?: number;
    tribe?: string;
    womens_organization?: boolean;
    youth_organization?: boolean;
    differently_abled_organization?: boolean;
    other_sectoral_group?: string;
    farmers_group?: boolean;
    fisherfolks?: boolean;
    mission?: string;
    vision?: string;
    partner_organization_bank?: PartnerOrganizationBank;
    partner_organization_other_information?: PartnerOrganizationOtherInformation;
    partner_organization_reference?: PartnerOrganizationReference[];
    description?: string;
    country_pk?: number;
    project_website?: string;
    date_created?: Date;
}

export interface PartnerOrganizationBank {
    pk?: number;
    partner_organization_pk?: number;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    bank_branch?: string;
    bank_address?: string;
    swift_code?: string;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface PartnerFiscalSponsor {
    pk?: number;
    application_pk?: number;
    name?: string;
    address?: string;
    head?: string;
    person_in_charge?: string;
    contact_number?: string;
    email_address?: string;
    bank_account_name?: string;
    account_number?: string;
    bank_name?: string;
    bank_branch?: string;
    bank_address?: string;
    swift_code?: string;
    date_created?: Date;
}

export interface ApplicationNonProfitEquivalencyDetermination {
    pk?: number;
    application_pk?: number;
    year?: Date;
    financial_last_year_usd?: string;
    financial_last_year_other?: string;
    financial_last_year_other_currency?: string;
    financial_last_year_source?: string;
    financial_current_usd?: string;
    financial_current_other?: string;
    financial_current_other_currency?: string;
    financial_current_source?: string;
    officers?: string;
    members?: string;
    operated_for?: OperatedFor;
    operated_for_others?: string;
    any_assets?: boolean;
    any_assets_description?: string;
    any_payments?: boolean;
    any_payments_description?: string;
    upon_dissolution?: boolean;
    is_controlled_by?: boolean;
    date_created?: Date;
}

export interface PartnerOrganizationOtherInformation {
    pk?: number;
    has_project?: boolean;
    has_financial_policy?: boolean;
    has_financial_policy_no_reason?: string;
    has_financial_system?: boolean;
    has_financial_system_no_reason?: string;
    audit_financial_available?: boolean;
    has_reviewed_financial_system?: boolean;
    recommendation?: string;
    created_by?: number;
    date_created?: Date;
    partner_organization_pk?: number;
    archived?: boolean;
}

export interface Project {
    pk?: number;
    application_pk?: number;
    title?: string;
    duration?: string;
    background?: string;
    objective?: string;
    expected_output?: string;
    how_will_affect?: string;
    status_pk?: number;
    type_pk?: number;
    date_created?: Date;
    project_proposal?: ProjectProposal;
    project_beneficiary?: ProjectBeneficiary[];
    project_location?: ProjectLocation[];
}

export interface ProjectBeneficiary {
    pk?: number;
    project_pk?: number;
    type?: string;
    name?: string;
    count?: number;
    date_created?: Date;
}

export interface ProjectLocation {
    pk?: number;
    project_pk?: number;
    country_pk?: number;
    province_code?: number;
    date_created?: Date;
}

export interface OperatedFor {
    cultural?: boolean;
    literacy?: boolean;
    religious?: boolean;
    charitable?: boolean;
    scientific?: boolean;
    education_purpose?: boolean;
}

export interface ProjectProposal {
    pk?: number;
    application_pk?: number;
    monitor?: string;
    budget_request_usd?: string;
    budget_request_other?: string;
    budget_request_other_currency?: string;
    date_created?: Date;
    project_proposal_activity?: ProjectProposalActivity[];
}

export interface ProjectProposalActivity {
    pk?: number;
    application_proposal_pk?: number;
    name?: string;
    duration?: string;
    date_created?: Date;
}

export interface PartnerOrganizationReference {
    pk?: number;
    application_pk?: number;
    name?: string;
    contact_number?: string;
    email_address?: string;
    organization_name?: string;
    date_created?: Date;
}

export interface Review {
    pk?: number;
    message: string;
    flag?: string;
    type: string;
    resolved?: boolean;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface Document {
    pk?: number;
    filename: string;
    original_name: string;
    path: string;
    size: string;
    mime_type: string;
    type: string;
    archived?: boolean;
}

export interface Recommendation {
    pk?: number;
    application_pk: number;
    recommendation: string;
    type: string;
    created_by?: number;
    archived?: boolean;
}
