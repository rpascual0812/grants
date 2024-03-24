import { ApplicationRead } from '../interfaces/application.interface';

// Interfaces or Types
export type TransformApplicationForList = ReturnType<typeof transformApplicationForList>;
export type CompareItemValue = string | number | Date;

export const transformApplicationForList = (applications: ApplicationRead[]) => {
    return applications.map((app) => ({
        applicationPk: app.pk as number,
        applicationNumber: app.number as string,
        uuid: app.uuid as string,
        partnerId: app?.partner?.partner_id ?? '',
        partner: app?.partner?.name ?? '',
        title: app?.application_project?.title ?? '',
        applicationDate: app?.date_created as Date,
        proposedBudget: app?.application_proposal?.budget_request_usd ?? '',
        proposedBudgetOther: app?.application_proposal?.budget_request_other ?? '',
        proposedBudgetOtherCurrency: app?.application_proposal?.budget_request_other_currency?.split('-')?.at(0)?.trim() ?? ''
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
