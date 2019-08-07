function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useLegacyState } from '../../hooks';
import Component from '../Component';
import Grid from './Grid';
export const Page = ({
  Container,
  initState,
  ...props
}) => {
  const [state, setState] = useLegacyState(initState);
  const [layouts, setLayouts] = useState(props.layouts);
  const [editable, setEditable] = useState(props.editable);
  const page = useMemo(() => ({
    initState,
    state,
    setState,
    layouts,
    setLayouts,
    editable,
    setEditable
  }), [initState, state, setState, layouts, setLayouts, editable, setEditable]);
  const data = useMemo(() => ({ ...props.data,
    page
  }), [props.data, page]);
  let widgets;

  if (Array.isArray(props.widgetIds)) {
    widgets = props.widgetIds.map(id => React.createElement("div", {
      key: id
    }, React.createElement(Component, _extends({
      id: id,
      data: data,
      components: props.components
    }, props.widgetMap.get(id)))));
  }

  return React.createElement(Container, data, React.createElement(Grid, _extends({}, props.grid, {
    editable: editable,
    layouts: layouts,
    onLayoutChange: (_, layouts) => setLayouts(layouts)
  }), widgets));
};
Page.defaultProps = {
  Container: ({
    children
  }) => {
    return React.createElement(Fragment, null, children);
  },
  data: {},
  editable: false,
  grid: {},
  initState: {},
  widgetMap: new Map()
};
Page.propTypes = {
  Container: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  data: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  grid: PropTypes.object.isRequired,
  initState: PropTypes.object.isRequired,
  widgetMap: PropTypes.shape({
    get: PropTypes.func.isRequired
  }).isRequired
};
export default memo(Page);