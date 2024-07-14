import { Donor, ProjectFunding } from './_project.interface';

// TODO: please use this for the new application save
export interface Application {
    pk?: number;
    uuid?: string;
    number?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    date_submitted?: Date;
    status?: string;
    archived?: boolean;
    needs_resolution?: boolean;
    grantee?: boolean;
    partner?: Partner;
    project?: Project;
    reviews?: Review[];
    documents?: Document[];
    recommendations?: Recommendation[];
    donor?: string;
}

export interface ApplicationStatus {
    pk?: number;
    partner_pk?: number;
    status?: string;
    archived?: boolean;
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
    partner_nonprofit_equivalency_determination?: PartnerNonProfitEquivalencyDetermination;
    contacts?: Contact[];
    projects?: Project[];
    documents?: Document[];
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
    country?: Country;
    project_website?: string;
    date_created?: Date;
}

export interface Country {
    pk?: number;
    name?: string;
    code?: string;
    dial_code?: string;
    currency?: string;
    currency_name?: string;
    currency_symbol?: string;
    currency_code?: string;
    date_created?: Date;
    active?: boolean;
    archived?: boolean;
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
    documents: Document[];
}

export interface PartnerNonProfitEquivalencyDetermination {
    pk?: number;
    partner_pk?: number;
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
    documents?: [];
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
    documents?: Document[];
    organization_other_information_financial_human_resources?: FinancialHumanResources[];
}

export interface FinancialHumanResources {
    pk?: number;
    partner_organization_other_information_pk?: number;
    name?: string;
    designation?: string;
    created_by?: number;
    date_created?: Date;
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
    status?: string;
    type_pk?: number;
    partner_pk?: number;
    date_created?: Date;
    project_proposal?: ProjectProposal;
    project_beneficiary?: ProjectBeneficiary;
    project_location?: ProjectLocation[];
    project_funding?: ProjectFunding[];
    reviews?: Review[];
    recommendations?: Recommendation[];
    type?: Type;
}

export interface Type {
    pk?: number;
    name: string;
    description?: string;
    date_created?: Date;
}

export interface ProjectBeneficiary {
    project_pk?: number;
    women_count?: number;
    women_diffable_count?: number;
    women_other_vulnerable_sector_count?: number;
    young_women_count?: number;
    young_women_diffable_count?: number;
    young_women_other_vulnerable_sector_count?: number;
    men_count?: number;
    men_diffable_count?: number;
    men_other_vulnerable_sector_count?: number;
    young_men_count?: number;
    young_men_diffable_count?: number;
    young_men_other_vulnerable_sector_count?: number;
    pk?: number;
    date_created?: Date;
    date_updated?: Date;
}

export interface ProjectLocation {
    country?: Country
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
    project_pk?: number;
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
    grantee?: boolean;
    needs_resolution?: boolean;
    type: string;
    resolved?: boolean;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
}

export interface Document {
    pk?: number;
    filename?: string;
    original_name?: string;
    path?: string;
    size?: string;
    mime_type?: string;
    type?: string;
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

export interface PartnerAssessment {
    pk?: number;
    partner_pk?: number;
    message?: string;
    created_by?: number;
    date_created?: Date;
    date_updated?: Date;
    archived?: boolean;
    user?: User;
}

export interface ProjectAssessment {
    pk?: number;
    project_pk?: number;
    donor_pk?: number;
    thematic_area_pk?: number;
    message?: string,
    created_by?: number,
    date_created?: Date;
    date_updated?: Date;
    archived?: boolean;
    user?: User;
    donor?: Donor;
}

export interface User {
    pk?: number;
    account_pk?: number;
    account?: Account;
    user_role?: UserRole[];
    uuid?: string;
    unique_id?: string;
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    gender_pk?: number;
    birthdate?: Date;
    mobile_number?: string;
    email_address?: string;
    archived?: boolean;
}

export interface Account {
    pk?: number;
    username: string;
    password?: string;
    active?: boolean;
    verified?: boolean;
    password_reset?: string;
    archived?: boolean;
}

export interface UserRole {
    pk?: number;
    role_pk: number;
    user_pk?: number;
    date_created?: Date;
    role?: Role;
}

export interface Role {
    pk?: number;
    name: string;
    details?: string;
    archived?: boolean;
    restrictions: Restriction;
}

export interface Restriction {
    grant_application?: string;
    fund_release?: string;
    contract_finalization?: string;
}

export interface Province {
    psgc_code?: string;
    region_code?: number;
    province_code?: number;
    name?: string;
    country_pk?: number;
    active?: boolean;
    user_pk?: number;
    archived?: boolean;
}

export interface KindOfOrganization {
    pk?: number;
    name?: string;
    description?: string;
    archived?: boolean;
}
