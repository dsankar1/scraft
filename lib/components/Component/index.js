import React, { memo, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLegacyState, useInterpolater } from '../../hooks';

const Component = ({
  id,
  initState,
  ...props
}) => {
  const [state, setState] = useLegacyState(initState);
  const data = useMemo(() => ({ ...props.data,
    initState,
    state,
    setState
  }), [props.data, initState, state, setState]);
  const config = useMemo(() => ({
    onMount: props.onMount,
    onUnmount: props.onUnmount,
    component: props.component,
    handlers: props.handlers
  }), [props.onMount, props.onUnmount, props.component, props.handlers]);
  const {
    onMount,
    onUnmount,
    component
  } = useInterpolater(config, data);
  useEffect(() => {
    if (typeof onMount === 'function') {
      onMount();
    }

    if (typeof onUnmount === 'function') {
      return onUnmount;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  const Component = props.components[component.type];

  if (Component) {
    return React.createElement(Component, component.props, props.children);
  } else {
    console.error(`Failed to render component ${id}`);
    return null;
  }
};

Component.defaultProps = {
  component: {},
  components: {},
  data: {},
  initState: {}
};
Component.propTypes = {
  component: PropTypes.shape({
    type: PropTypes.string.isRequired,
    props: PropTypes.object
  }).isRequired,
  components: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handlers: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    function: PropTypes.string,
    parameters: PropTypes.array
  }))),
  id: PropTypes.string.isRequired,
  initState: PropTypes.object.isRequired
};
export default memo(Component);