import React from 'react';
import useInterpolator from './useInterpolator';

export const Interpolate = React.memo(props => {
    const Component = React.useMemo(() => props.Component, [props.Component]);

    const interpolated = useInterpolator(props);

    return Component && (
        <Component {...interpolated}>
            {props.children}
        </Component>
    );
});

export default Interpolate;
