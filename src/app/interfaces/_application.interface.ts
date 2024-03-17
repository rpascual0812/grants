// TODO: please use this for the new application save
export interface Application {
    pk?: number;
    uuid?: string;
    number?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    status_pk?: null;
    archived?: boolean;
    partner?: Partner;
    application_project?: any;
    application_proposal?: any;
    application_fiscal_sponsor?: ApplicationFiscalSponsor;
    application_nonprofit_equivalency_determination?: ApplicationNonProfitEquivalencyDetermination;
    application_reference?: any[];
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
    contacts?: Contact[];
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
    description?: string;
    country_pk?: number;
    project_website?: string;
    date_created?: Date;
}

export interface ApplicationFiscalSponsor {
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

export interface OperatedFor {
    cultural?: boolean;
    literacy?: boolean;
    religious?: boolean;
    charitable?: boolean;
    scientific?: boolean;
    education_purpose?: boolean;
}
