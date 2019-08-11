import React, { memo, useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useLegacyState } from '../../hooks';
import Component from '../Component';
import Grid from './Grid';

export const Page = ({ Container, initState, ...props }) => {
    const [state, setState] = useLegacyState(initState);
    const [layouts, setLayouts] = useState(props.layouts);
    const [editable, setEditable] = useState(props.editable);
    const [breakpoint, setBreakpoint] = useState();

    const page = useMemo(
        () => ({
            initState,
            state,
            setState,
            layouts,
            setLayouts,
            editable,
            setEditable,
            breakpoint
        }),
        [
            initState,
            state,
            setState,
            layouts,
            setLayouts,
            editable,
            setEditable,
            breakpoint
        ]
    );

    const data = useMemo(() => ({ ...props.data, page }), [props.data, page]);

    let widgets;
    if (Array.isArray(props.widgetIds)) {
        widgets = props.widgetIds.map(id => (
            <div key={id}>
                <Component
                    id={id}
                    data={data}
                    components={props.components}
                    {...props.widgetMap.get(id)}
                />
            </div>
        ));
    }

    return (
        <Container {...data}>
            <Grid
                {...props.grid}
                editable={editable}
                layouts={layouts}
                onLayoutChange={(_, layouts) => setLayouts(layouts)}
                onBreakpointChange={breakpoint => setBreakpoint(breakpoint)}
            >
                {widgets}
            </Grid>
        </Container>
    );
};

Page.defaultProps = {
    Container: ({ children }) => {
        return <Fragment>{children}</Fragment>;
    },
    data: {},
    editable: false,
    grid: {},
    initState: {},
    widgetMap: new Map()
};

Page.propTypes = {
    Container: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    grid: PropTypes.object.isRequired,
    initState: PropTypes.object.isRequired,
    widgetMap: PropTypes.shape({
        get: PropTypes.func.isRequired
    }).isRequired
};

export default memo(Page);
