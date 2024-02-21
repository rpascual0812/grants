// Application Create
export interface ApplicationCreate {
    uuid?: string;
    proponent?: ProponentCreate;
    organization_profile?: OrganizationProfileCreate;
}

export interface OrganizationProfileCreate {
    organization_pk?: number;
    mission?: string;
    vision?: string;
    description?: string;
    country_pk?: number;
    project_website?: string;
}

export interface ProponentCreate {
    name?: string;
    address?: string;
    contact_number?: string;
    email_address?: string;
    website?: string;
}

// Application Read
export interface ApplicationRead {
    pk?: number;
    uuid?: string;
    created_by?: number;
    date_created?: Date;
    archived?: boolean;
    application_proponent?: ApplicationProponentRead | null;
    application_organization_profile?: ApplicationOrganizationProfileRead | null;
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
