import { Application } from '../interfaces/_application.interface';

// Interfaces or Types
export type TransformApplicationForList = ReturnType<typeof transformApplicationForList>;
export type CompareItemValue = string | number | Date;
export interface ApiError extends Error {
    error?: {
        message?: string;
    };
    status?: string;
}

export const transformApplicationForList = (applications: Application[]) => {
    return applications.map((app) => ({
        applicationPk: app.pk as number,
        applicationNumber: app.number as string,
        uuid: app.uuid as string,
        partnerId: app?.partner?.partner_id ?? '',
        partner: app?.partner?.name ?? '',
        title: app?.project?.title ?? '',
        applicationDate: app?.date_created as Date,
        proposedBudget: app?.project?.project_proposal?.budget_request_usd ?? '',
        proposedBudgetOther: app?.project?.project_proposal?.budget_request_other ?? '',
        proposedBudgetOtherCurrency:
            app?.project?.project_proposal?.budget_request_other_currency?.split('-')?.at(0)?.trim() ?? '',
    }));
};

export const compare = (v1: CompareItemValue, v2: CompareItemValue) => {
    if (v1 instanceof Date && v2 instanceof Date) {
        return v1?.getTime() < v2?.getTime() ? -1 : v1?.getTime() > v2?.getTime() ? 1 : 0;
    }
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

export const getDurationOpts = () => {
    let durationOpts = [];
    for (let i = 1; i <= 36; i++) {
        let suffix = 'Months';
        if (i === 1) {
            suffix = 'Month';
        }
        durationOpts.push(`${i} ${suffix}`);
    }
    return durationOpts;
};

export const extractErrorMessage = (err: ApiError) => {
    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
    const statusCode = err?.status ? `status: ${err?.status}` : '';
    return {
        errorMessage,
        statusCode,
    };
};
