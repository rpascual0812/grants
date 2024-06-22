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
    },
    'CapDev / Institutional Development Support': {
        associatedKey: ['Capacity Development', 'Institutional Development'],
        total: 0,
        imagePath: '../../../assets/images/group-icon.png',
        color: '#3B5E61FF',
    },
    'Urgent Grant Action': {
        associatedKey: ['Urgent Grant'],
        total: 0,
        imagePath: '../../../assets/images/police-light-icon.png',
        color: '#84A6EFFF',
    },
    'Education Grant and Indigenous Knowledge Building': {
        associatedKey: ['Education Grant', 'Indigenous Knowledge Building'],
        total: 0,
        imagePath: '../../../assets/images/education-icon.png',
        color: '#fcc203',
    },
    'Resiliency Building and Social Justice Grant': {
        associatedKey: ['Resiliency Building', 'Social Justice Grant'],
        total: 0,
        imagePath: '../../../assets/images/justice-hammer-icon.png',
        color: '#7591EDFF',
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
export const AVAILABLE_PROJECT_STATUS: AvailableProjectStatus[] = [
    'Contract Preparation',
    'Final Approval',
    'Partner Signing',
    'Fund Release',
    'Completed',
];
