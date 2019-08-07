import React, { memo } from 'react';
import Component from '../components/Component';

export const recursiveRender = (containers, props = {}, index = 0) => {
    if (Array.isArray(containers) && index < containers.length) {
        const Container = containers[index];
        if (Container) {
            return (
                <Container {...props}>
                    {recursiveRender(containers, props, index + 1)}
                </Container>
            );
        }
    } else {
        return props.children;
    }
};

export const composeContainers = (containerMap, containerIds, components) => {
    let CompositeContainer = ({ children }) => children;

    if (Array.isArray(containerIds)) {
        const containers = containerIds.map(id => {
            return ({ children, ...data }) => (
                <Component
                    id={id}
                    data={data}
                    components={components}
                    {...containerMap.get(id)}
                >
                    {children}
                </Component>
            );
        });
        CompositeContainer = props => recursiveRender(containers, props);
    }

    return memo(CompositeContainer);
};

export default composeContainers;
