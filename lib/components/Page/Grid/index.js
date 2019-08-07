function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Helmet } from 'react-helmet';
import { getStyles } from './styles';
const ResponsiveGrid = WidthProvider(Responsive);

const Grid = ({
  children,
  placeholder,
  editable,
  ...others
}) => {
  const styles = useMemo(() => {
    return getStyles(placeholder);
  }, [placeholder]);
  return React.createElement(Fragment, null, React.createElement(Helmet, null, React.createElement("style", {
    type: "text/css"
  }, styles)), React.createElement(ResponsiveGrid, _extends({}, others, {
    className: "layout",
    isDraggable: editable,
    isResizable: editable,
    isRearrangeable: editable
  }), children));
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