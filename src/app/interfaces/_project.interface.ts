import {
    Application,
    Partner,
    ProjectBeneficiary,
    ProjectLocation,
    ProjectProposal,
    Type,
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
    partner?: Partner;
    type?: Type;
}
