/* eslint-disable */
export default {
    app: {
        initState: {},
        containerIds: [],
        routes: [
            {
                path: '/',
                exact: true,
                pageId: 'root'
            },
            {
                path: '/home',
                pageId: 'home'
            }
        ]
    },
    pages: [
        {
            id: 'root',
            initState: {},
            containerIds: ['blackContainer'],
            widgetIds: ['greenBlock'],
            layouts: {
                lg: [
                    {
                        i: 'greenBlock',
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 5
                    }
                ]
            }
        },
        {
            id: 'home',
            initState: {},
            containerIds: ['blackContainer'],
            widgetIds: ['redBlock'],
            layouts: {
                lg: [
                    {
                        i: 'redBlock',
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 5
                    }
                ]
            }
        }
    ],
    containers: [
        {
            id: 'blackContainer',
            component: {
                type: 'Container',
                props: {
                    background: 'black'
                }
            }
        }
    ],
    widgets: [
        {
            id: 'greenBlock',
            handlers: {
                handleMount: [
                    {
                        function: '${utils.log}',
                        parameters: ['Green block mounted']
                    }
                ],
                handleClick: [
                    {
                        function: '${router.history.push}',
                        parameters: ['/home']
                    }
                ]
            },
            onMount: '${handlers.handleMount}',
            component: {
                type: 'Block',
                props: {
                    onClick: '${handlers.handleClick}',
                    background: 'green'
                }
            }
        },
        {
            id: 'redBlock',
            handlers: {
                handleMount: [
                    {
                        function: '${utils.log}',
                        parameters: ['Red block mounted']
                    }
                ],
                handleClick: [
                    {
                        function: '${router.history.push}',
                        parameters: ['/']
                    }
                ]
            },
            onMount: '${handlers.handleMount}',
            component: {
                type: 'Block',
                props: {
                    onClick: '${handlers.handleClick}',
                    background: 'red'
                }
            }
        }
    ]
};
