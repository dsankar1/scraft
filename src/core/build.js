import React, { memo, useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useLegacyState } from './hooks';
import { objArrayToMap, composeContainers } from './utils';
import { configSchema } from './constants';
import Page from './components/Page';

export default (config, components, utils) => {
    configSchema.validate(config).catch(({ message }) => {
        console.error('Scraft Configuration: ' + message);
    });

    const { initState = {}, containerIds, routes } = config.app;
    const pageMap = objArrayToMap(config.pages);
    const containerMap = objArrayToMap(config.containers);
    const widgetMap = objArrayToMap(config.widgets);
    const Container = composeContainers(containerMap, containerIds, components);

    const pageContainerMap = new Map();
    pageMap.forEach(({ containerIds }, pageId) => {
        const PageContainer = composeContainers(
            containerMap,
            containerIds,
            components
        );
        pageContainerMap.set(pageId, PageContainer);
    });

    return memo(props => {
        const [state, setState] = useLegacyState(initState);

        const app = useMemo(
            () => ({
                initState,
                state,
                setState
            }),
            [state, setState]
        );

        let pages;
        if (Array.isArray(routes)) {
            pages = routes.map(({ pageId, ...routeProps }) => {
                const { path } = routeProps;
                return (
                    <Route
                        {...routeProps}
                        key={path}
                        render={router => (
                            <Page
                                id={pageId}
                                components={components}
                                Container={pageContainerMap.get(pageId)}
                                data={{
                                    props,
                                    app,
                                    router,
                                    utils
                                }}
                                widgetMap={widgetMap}
                                {...pageMap.get(pageId)}
                            />
                        )}
                    />
                );
            });
        }

        return (
            <BrowserRouter>
                <Route
                    render={router => (
                        <Container
                            props={props}
                            app={app}
                            router={router}
                            utils={utils}
                        >
                            <Switch>{pages}</Switch>
                        </Container>
                    )}
                />
            </BrowserRouter>
        );
    });
};
