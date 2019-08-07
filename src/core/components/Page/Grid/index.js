import React, { memo, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Helmet } from 'react-helmet';
import { getStyles } from './styles';

const ResponsiveGrid = WidthProvider(Responsive);

const Grid = ({ children, placeholder, editable, ...others }) => {
    const styles = useMemo(() => {
        return getStyles(placeholder);
    }, [placeholder]);

    return (
        <Fragment>
            <Helmet>
                <style type='text/css'>{styles}</style>
            </Helmet>
            <ResponsiveGrid
                {...others}
                className='layout'
                isDraggable={editable}
                isResizable={editable}
                isRearrangeable={editable}
            >
                {children}
            </ResponsiveGrid>
        </Fragment>
    );
};

Grid.defaultProps = {
    breakpoints: {
        lg: 1200,
        md: 992,
        sm: 768,
        xs: 0
    },
    cols: {
        lg: 12,
        md: 12,
        sm: 12,
        xs: 12
    },
    editable: false,
    margin: [0, 0],
    placeholder: 'rgba(0, 0, 0, 0.15)',
    rowHeight: 10
};

Grid.propTypes = {
    editable: PropTypes.bool,
    placeholder: PropTypes.string
};

export default memo(Grid);
