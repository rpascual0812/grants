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
    application_fiscal_sponsor?: any;
    application_nonprofit_equivalency_determination?: any;
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
