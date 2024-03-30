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

export const PROVINCE_URL_FETCH_STATUS = {
    notReady: 'notReady',
    ready: 'ready',
};

export const GRANT_TYPES = [
    'Travel Grant',
    'Capacity Development',
    'Urgent Grant',
    'Education Grant',
    'Indigenous Knowledge Building',
    'Resiliency Building',
    'Social Justice Grant',
    'Institutional Development',
];

export const THEMATIC_AREAS = [
    'Tenure',
    'Natural Resource Governance',
    'Living Economy',
    'Mitigating & Adapting to Climate Change',
    'Governance and Leadership Development',
    'Next Generation',
    'Disability Rights in the Intersection of Environmental Justice',
];

export const BENEFICIARY_TYPE = ['women', 'men', 'young_women', 'young_men'];
export const BENEFICIARY_NAME = (type: string) => {
    const mainName = type?.split('_').join(' ');
    const tempName = type?.split('_');
    let diffName = type?.split('_')?.at(0);
    if (tempName.length > 1) {
        diffName = type?.split('_')?.at(1);
    }
    return [mainName, `diffable ${diffName}`, 'other vulnerable sector'];
};
