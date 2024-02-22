// Application Save
export interface ApplicationSave {
    uuid?: string;
    proponent?: ProponentSave;
    organization_profile?: OrganizationProfileSave;
}

export interface OrganizationProfileSave {
    organization_pk?: number;
    mission?: string;
    vision?: string;
    description?: string;
    country_pk?: number;
    project_website?: string;
    archived?: boolean;
}

export interface ProponentSave {
    name?: string;
    address?: string;
    contact_number?: number;
    email_address?: string;
    website?: string;
    archived?: boolean;
}

// Application Read
export interface ApplicationRead {
    pk?: number;
    uuid?: string;
    partner_pk?: number;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
    partner?: PartnerRead;
    application_proponent?: ApplicationProponentRead;
    application_organization_profile?: ApplicationOrganizationProfileRead;
    application_project?: null;
}

export interface ApplicationOrganizationProfileRead {
    pk?: number;
    application_pk?: number;
    organization_pk?: number;
    mission?: string;
    vision?: string;
    description?: string;
    country_pk?: number;
    project_website?: string;
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
}

export interface PartnerRead {
    pk?: number;
    partner_id?: string;
    name?: string;
    email_address?: string;
    date_created?: Date;
    archived?: boolean;
}
