// Application Save
export interface ApplicationSave {
    uuid?: string;
    proponent?: ProponentSave;
    organization_profile?: OrganizationProfileSave;
    project?: ProjectSave;
    proposal?: ProposalSave;
    fiscal_sponsor?: FiscalSponsorSave;
    non_profit_equivalency_determination?: NonProfitEquivalencyDeterminationSave;
    references?: ReferenceSave[];
}

export interface ProponentSave {
    name?: string;
    address?: string;
    contact_number?: string;
    email_address?: string;
    website?: string;
    contact_person_name?: string;
    contact_person_number?: string;
    contact_person_email_address?: string;
}

export interface OrganizationProfileSave {
    organization_pk?: number;
    mission?: string;
    vision?: string;
    description?: string;
    country_pk?: number;
    project_website?: string;
    tribe?: string;
    womens_organization?: boolean;
    differently_abled_organization?: boolean;
    youth_organization?: boolean;
    farmers_group?: boolean;
    fisherfolks?: boolean;
    other_sectoral_group?: string;
}

export interface ProjectSave {
    title?: string;
    duration?: string;
    background?: string;
    objective?: string;
    expected_output?: string;
    how_will_affect?: string;
    beneficiary_women?: BeneficiarySave[];
    beneficiary_young_women?: BeneficiarySave[];
    beneficiary_men?: BeneficiarySave[];
    beneficiary_young_men?: BeneficiarySave[];
    project_locations?: ProjectLocationSave[];
}

export interface BeneficiarySave {
    type?: string;
    name?: string;
    count?: number;
}

export interface ProjectLocationSave {
    country_pk?: number;
    province_code?: number;
    province_code_url?: string;
}

export interface ProposalSave {
    monitor?: string;
    budget_request_usd?: number;
    budget_request_other?: number;
    budget_request_other_currency?: string;
    activities?: ActivitySave[];
}

export interface ActivitySave {
    name?: string;
    duration?: string;
}

export interface FiscalSponsorSave {
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
}

export interface NonProfitEquivalencyDeterminationSave {
    year?: Date;
    financial_last_year_usd?: number;
    financial_last_year_other?: number;
    financial_last_year_other_currency?: string;
    financial_last_year_source?: string;
    financial_current_usd?: number;
    financial_current_other?: number;
    financial_current_other_currency?: string;
    financial_current_source?: string;
    officers?: string;
    members?: string;
    operated_for_others?: string;
    any_assets?: boolean;
    any_assets_description?: string;
    any_payments?: boolean;
    any_payments_description?: string;
    upon_dissolution?: boolean;
    is_controlled_by?: boolean;
    operated_for: OperatedForSave;
}

export interface OperatedForSave {
    charitable?: boolean;
    literacy?: boolean;
    cultural?: boolean;
    religious?: boolean;
    education_purpose?: boolean;
    scientific?: boolean;
}

export interface ReferenceSave {
    name?: string;
    contact_number?: string;
    email_address?: string;
    organization_name?: string;
}

// Application Read
export interface ApplicationRead {
    pk?: number;
    uuid?: string;
    number?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    status_pk?: null;
    archived?: boolean;
    partner?: PartnerRead;
    application_proponent?: ApplicationProponentRead;
    application_organization_profile?: ApplicationOrganizationProfileRead;
    application_project?: ApplicationProjectRead;
    application_proposal?: ApplicationProposalRead;
    application_fiscal_sponsor?: ApplicationFiscalSponsorRead;
    application_nonprofit_equivalency_determination?: ApplicationNonprofitEquivalencyDeterminationRead;
    application_reference?: ApplicationReferenceRead[];
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
    operated_for?: OperatedForRead;
    operated_for_others?: string;
    any_assets?: boolean;
    any_assets_description?: string;
    any_payments?: boolean;
    any_payments_description?: string;
    upon_dissolution?: boolean;
    is_controlled_by?: boolean;
    date_created?: Date;
}

export interface OperatedForRead {
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

export interface ApplicationProjectRead {
    pk?: number;
    application_pk?: number;
    title?: string;
    duration?: string;
    background?: string;
    objective?: string;
    expected_output?: string;
    how_will_affect?: string;
    date_created?: Date;
    application_project_location?: ApplicationProjectLocationRead[];
}

export interface ApplicationProjectLocationRead {
    pk?: number;
    application_project_pk?: number;
    province_code_url?: string;
    country_pk?: number;
    province_code?: number;
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
    contact_person?: ContactPersonRead[];
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
    application_proposal_activity?: ApplicationProposalActivityRead[];
}

export interface ApplicationProposalActivityRead {
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
    date_created?: Date;
    archived?: boolean;
}
