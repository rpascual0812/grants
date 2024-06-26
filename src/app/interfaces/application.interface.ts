// Application Save

// Application Read
export interface ApplicationRead {
    pk?: number;
    uuid?: string;
    number?: string;
    donor?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    status_pk?: number;
    archived?: boolean;
    partner?: PartnerRead;
    application_proponent?: ApplicationProponentRead;
    application_organization_profile?: ApplicationOrganizationProfileRead;
    project?: ProjectRead;
    application_proposal?: ApplicationProposalRead;
    application_fiscal_sponsor?: ApplicationFiscalSponsorRead;
    application_nonprofit_equivalency_determination?: ApplicationNonprofitEquivalencyDeterminationRead;
    application_reference?: ApplicationReferenceRead[];
    reviews?: ReviewRead[];
    documents?: DocumentRead[];
    recommendations?: RecommendationRead[];
}

export interface ApplicationFiscalSponsorRead {
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
    date_created?: Date;
}

export interface ApplicationNonprofitEquivalencyDeterminationRead {
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

export interface OperatedFor {
    cultural?: boolean;
    literacy?: boolean;
    religious?: boolean;
    charitable?: boolean;
    scientific?: boolean;
    education_purpose?: boolean;
}

export interface ApplicationOrganizationProfileRead {
    pk?: number;
    application_pk?: number;
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
    description?: string;
    country_pk?: number;
    project_website?: string;
    date_created?: Date;
}

export interface ProjectRead {
    pk?: number;
    application_pk?: number;
    title?: string;
    duration?: string;
    background?: string;
    objective?: string;
    expected_output?: string;
    how_will_affect?: string;
    type_pk?: number;
    date_created?: Date;
    project_location?: ApplicationProjectLocationRead[];
}

export interface ApplicationProjectLocationRead {
    pk?: number;
    project_pk?: number;
    country_pk?: number;
    province_code?: number;
    province_code_url?: string;
    date_created?: Date;
}

export interface ApplicationProponentRead {
    pk?: number;
    application_pk?: number;
    name?: string;
    address?: string;
    contact_number?: string;
    email_address?: string;
    website?: string;
    date_created?: Date;
    contacts?: ContactPersonRead[];
}

export interface ContactPersonRead {
    pk?: number;
    application_proponent_pk?: number;
    name?: string;
    contact_number?: string;
    email_address?: string;
    date_created?: Date;
}

export interface ApplicationProposalRead {
    pk?: number;
    application_pk?: number;
    monitor?: string;
    budget_request_usd?: number;
    budget_request_other?: string;
    budget_request_other_currency?: string;
    date_created?: Date;
    application_proposal_activity?: ApplicationProposalActivity[];
}

export interface ApplicationProposalActivity {
    pk?: number;
    application_proposal_pk?: number;
    name?: string;
    duration?: string;
    date_created?: Date;
}

export interface ApplicationReferenceRead {
    pk?: number;
    application_pk?: number;
    name?: string;
    contact_number?: string;
    email_address?: string;
    organization_name?: string;
    date_created?: Date;
}

export interface PartnerRead {
    pk?: number;
    partner_id?: string;
    name?: string;
    email_address?: string;
    contacts?: PartnerContacts[];
    organization?: PartnerOrganization;
    address?: string;
    contact_number?: string;
    website?: string;
    date_created?: Date;
    grand_total_amount?: number;
    application?: PartnerApplications[];
    archived?: boolean;
}

export interface PartnerContacts {
    pk?: number;
    partner_pk?: number;
    name?: string;
    contact_number?: string;
    email_address?: string;
    date_created?: Date;
}

export interface PartnerOrganization {
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
    description?: string;
    country_pk?: number;
    country?: Country;
    project_website?: string;
    date_created?: Date;
}

export interface Country {
    pk?: number;
    name?: string;
    code?: string;
    dial_code?: string;
    currency_name?: string;
    currency_symbol?: string;
    currency_code?: string;
    date_created?: Date;
}

export interface PartnerApplications {
    pk?: number;
    uuid?: string;
    number?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    status_pk?: number;
    archived?: boolean;
    application_status?: ApplicationStatusesRead;
    project?: ProjectRead;
    application_proposal?: ApplicationProposalRead;
    application_fiscal_sponsor?: ApplicationFiscalSponsorRead;
    application_nonprofit_equivalency_determination?: ApplicationNonprofitEquivalencyDeterminationRead;
    application_reference?: ApplicationReferenceRead[];
}

export interface ApplicationStatusesRead {
    pk?: number;
    application_pk?: number;
    status_pk?: number;
    status?: StatusRead;
    archived?: boolean;
}

export interface StatusRead {
    pk?: number;
    name?: string;
    description?: string;
    parent_pk?: number;
    sort?: number;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface ReviewRead {
    pk?: number;
    message: string;
    flag?: string;
    type: string;
    resolved?: boolean;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface DocumentRead {
    pk?: number;
    filename: string;
    original_name: string;
    path: string;
    size: string;
    mime_type: string;
    type: string;
    archived?: boolean;
}

export interface RecommendationRead {
    pk?: number;
    application_pk: number;
    recommendation: string;
    type: string;
    created_by?: number;
    archived?: boolean;
}