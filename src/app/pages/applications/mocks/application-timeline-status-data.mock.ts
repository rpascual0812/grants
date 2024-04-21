export const APPLICATION_TIMELINE_STATUS_DATA_MOCK = [
    {
        id: '1',
        title: `Grant Application`,
        label: `Due Date: September 20, 2023`,
        showVerticalLine: true,
        status: 'on-progress',
        items: [
            {
                id: '1',
                label: 'Test with button',
                status: 'on-progress',
                button: {
                    label: `test`,
                    type: `info`,
                    eventKey: `handleOnUploadSignedContract`,
                    buttonType: 'button',
                },
            },
            {
                id: '2',
                label: 'Inprogress Mock',
                status: 'on-progress',
            },
            {
                id: '3',
                label: 'Complete Mock',
                status: 'complete',
            },
            {
                id: '4',
                label: 'Complete Mock',
                status: 'complete',
            },
            {
                id: '5',
                label: 'Complete Mock',
                status: 'complete',
            },
            {
                id: '6',
                label: 'Complete Mock',
                status: 'on-progress',
            },
        ],
    },
    {
        id: '2',
        title: `Reviewing and Processing`,
        showVerticalLine: true,
        status: 'complete',
        button: {
            label: `Upload Signed Contract`,
            type: `info`,
            eventKey: `handleOnUploadSignedContract`,
            buttonType: 'button',
        },
        items: [
            {
                id: '1',
                label: 'Complete',
                status: 'complete',
                button: {
                    label: `click here to edit or review`,
                    type: `info`,
                    eventKey: `handleOnUploadSignedContract`,
                    buttonType: 'button',
                },
            },
        ],
    },
    {
        id: '3',
        title: `Approved`,
        showVerticalLine: true,
        status: 'approved',
        items: [
            {
                id: '1',
                label: 'Approved Something else',
                status: 'complete',
            },
        ],
    },
    {
        id: '4',
        title: `Not Approved`,
        showVerticalLine: false,
        status: 'notApproved',
        items: [
            {
                id: '1',
                label: 'Something went wrong while processing.',
                status: 'notApproved',
                button: {
                    label: `click here`,
                    type: `danger`,
                    eventKey: `handleOnClickHere`,
                    buttonType: 'link',
                },
            },
        ],
    },
];
