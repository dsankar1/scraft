import { array, object, string, number, boolean } from 'yup';

const routeSchema = object().shape({
    path: string().required(),
    pageId: string().required()
});

const layoutSchema = object().shape({
    i: string().required(),
    x: number().required(),
    y: number().required(),
    w: number().required(),
    h: number().required(),
    minW: number(),
    minH: number(),
    maxW: number(),
    maxH: number()
});

const pageSchema = object().shape({
    id: string().required(),
    initState: object(),
    initLayoutMode: boolean(),
    containerIds: array().of(string()),
    widgetIds: array().of(string()),
    layouts: object().shape({
        lg: array().of(layoutSchema),
        md: array().of(layoutSchema),
        sm: array().of(layoutSchema),
        xs: array().of(layoutSchema)
    }),
    grid: object().shape({
        margin: array()
            .of(number())
            .max(2),
        padding: array()
            .of(number())
            .max(2),
        cols: object().shape({
            lg: number(),
            md: number(),
            sm: number(),
            xs: number()
        }),
        rowHeight: number()
    })
});

const compWrapperSchema = object().shape({
    id: string().required(),
    initState: object(),
    handlers: object(),
    onMount: string(),
    onUnmount: string(),
    component: object()
        .shape({
            type: string().required(),
            props: object()
        })
        .required()
});

export const configSchema = object()
    .shape({
        app: object()
            .shape({
                initState: object(),
                containerIds: array().of(string()),
                routes: array().of(routeSchema)
            })
            .required(),
        pages: array().of(pageSchema),
        containers: array().of(compWrapperSchema),
        widgets: array().of(compWrapperSchema)
    })
    .required()
    .strict();
