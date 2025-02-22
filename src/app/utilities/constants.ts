export const KIND_OF_ORGANIZATION_MAPPER = {
    1: `Community/informal`,
    2: `Local organization/People's organization`,
    3: `Non-Government organization`,
    4: `Other organizations`,
} as const;

export const TRIBE_LIST_OPTIONS = [
    'Faith-based',
    'Academe or research',
    'Media',
    'Foundation/charitable',
    'Government-affiliated',
    'Private/business or corporate-affiliated',
    'Others',
];

export const USD_CURRENCY = [{ key: 'USD', label: 'US Dollars' }];

export const OTHER_CURRENCY_LIST = [
    {
        key: 'B$',
        label: 'Brunei Dollar',
    },
    {
        key: 'K',
        label: 'Myanmar Kyat',
    },
    {
        key: 'IDR',
        label: 'Indonesian Rupiah',
    },
    {
        key: '₭',
        label: 'Lao Kip',
    },
    {
        key: 'MYR',
        label: 'MALAYSIAN Ringgit',
    },
    {
        key: 'PHP',
        label: 'Philippine Peso',
    },
    {
        key: 'SGD',
        label: 'Singapore Dollar',
    },
    {
        key: 'THB',
        label: 'Thai Baht',
    },
    {
        key: 'VND',
        label: 'Vietnamese Dong',
    },
];

export const getOtherCurrencyKey = (otherCurrencyLabel: string) => {
    const key = otherCurrencyLabel?.split('-').at(0)?.trim() ?? '';
    return OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(key))?.key;
};

export const PROVINCE_URL_FETCH_STATUS = {
    notReady: 'notReady',
    ready: 'ready',
};

export const TOTAL_GRANT_PER_FUNCTION = {
    'Travel Grant': {
        associatedKey: ['Travel Grant'],
        total: 0,
        imagePath: '../../../assets/images/travel-icon.png',
        color: '#23327FFF',
        description: `Support for travels of members of CSOs and IPLCs to attend meetings, conferences, and other capacity development, research, or knowledge sharing activities/events.`,
    },
    'CapDev / Institutional Development Support': {
        associatedKey: ['Capacity Development', 'Institutional Development'],
        total: 0,
        imagePath: '../../../assets/images/group-icon.png',
        color: '#3B5E61FF',
        description: `Empower and equip strategically local CSOs and IPLCs to cater to the requirement of organization good governance.`,
    },
    'Urgent Grant Action': {
        associatedKey: ['Urgent Grant'],
        total: 0,
        imagePath: '../../../assets/images/police-light-icon.png',
        color: '#84A6EFFF',
        description: `Support activists, communities, CSOs who are in emergency situations that sometimes mean life and death for a community or an individual, i.e. for urgent evacuation, or for local responders in natural disasters, other support for legal action and others.`,
    },
    'Education Grant and Indigenous Knowledge Building': {
        associatedKey: ['Education Grant', 'Indigenous Knowledge Building'],
        total: 0,
        imagePath: '../../../assets/images/education-icon.png',
        color: '#fcc203',
        description: `Assist the member of IPLCs in enrolling in various formal and/or informal/or vocational training/education programmes to equip them with the necessary knowledge for better management capacity; good governance and/or livelihoods improvement.`,
    },
    'Resiliency Building and Social Justice Grant': {
        associatedKey: ['Resiliency Building', 'Social Justice Grant'],
        total: 0,
        imagePath: '../../../assets/images/justice-hammer-icon.png',
        color: '#7591EDFF',
        description: `Provide support for indigenous peoples, local communities, individual leaders and activists, CSOs and networks of social and environmental movements in SEA to improve their ability to respond to the ever changing conditions in the region.`,
    },
};

export type TotalGrantPerFunction = typeof TOTAL_GRANT_PER_FUNCTION;
export type TotalGrantPerFunctionKey = keyof typeof TOTAL_GRANT_PER_FUNCTION;

export const THEMATIC_AREAS = [
    'Tenure',
    'Natural Resource Governance',
    'Living Economy',
    'Mitigating & Adapting to Climate Change',
    'Governance and Leadership Development',
    'Next Generation',
    'Disability Rights in the Intersection of Environmental Justice',
];

export const REFERENCES_FACTORY = () => {
    return [
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
    ];
};

export const PROJECT_LESSON_TYPES = {
    challenges: 'challenges',
    lessons: 'lessons',
};

export type ProjectLessonTypeKey = keyof typeof PROJECT_LESSON_TYPES;

export type AvailableApplicationStatus =
    | 'Received Proposals'
    | 'Grants Team Review'
    | 'Advisers Review'
    | 'Budget Review and Finalization'
    | 'Financial Management Capacity'
    | 'Due Diligence Final Review';

export const AVAILABLE_APPLICATION_STATUS: AvailableApplicationStatus[] = [
    'Received Proposals',
    'Grants Team Review',
    'Advisers Review',
    'Budget Review and Finalization',
    'Financial Management Capacity',
    'Due Diligence Final Review',
];

export type AvailableProjectStatus =
    | 'Contract Preparation'
    | 'Final Approval'
    | 'Partner Signing'
    | 'Fund Release'
    | 'Completed';
export type AvailableProjectStatusObjKey =
    | 'contractPreparation'
    | 'finalApproval'
    | 'partnerSigning'
    | 'fundRelease'
    | 'completed';
export const AVAILABLE_PROJECT_STATUS_OBJ: Record<AvailableProjectStatusObjKey, AvailableProjectStatus> = {
    contractPreparation: 'Contract Preparation',
    finalApproval: 'Final Approval',
    partnerSigning: 'Partner Signing',
    fundRelease: 'Fund Release',
    completed: 'Completed',
};
export const AVAILABLE_PROJECT_STATUS: AvailableProjectStatus[] = [
    AVAILABLE_PROJECT_STATUS_OBJ.contractPreparation,
    AVAILABLE_PROJECT_STATUS_OBJ.finalApproval,
    AVAILABLE_PROJECT_STATUS_OBJ.partnerSigning,
    AVAILABLE_PROJECT_STATUS_OBJ.fundRelease,
    AVAILABLE_PROJECT_STATUS_OBJ.completed,
];

export type GrantClosingStatus = 'Completed' | 'For Follow Up' | 'Closing Letter Sent';
export type GrantClosingStatusKey = 'completed' | 'forFollowUp' | 'closingLetterSent';
export const GRANT_CLOSING_STATUS: Record<GrantClosingStatusKey, GrantClosingStatus> = {
    completed: 'Completed',
    forFollowUp: 'For Follow Up',
    closingLetterSent: 'Closing Letter Sent',
};

export const INTERIM_NARRATIVE_REPORT = 'interim narrative report';
export const INTERIM_FINANCIAL_REPORT = 'interim financial report';
