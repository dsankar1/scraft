function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo } from 'react';
import Component from '../components/Component';
export const recursiveRender = (containers, props = {}, index = 0) => {
  if (Array.isArray(containers) && index < containers.length) {
    const Container = containers[index];

    if (Container) {
      return React.createElement(Container, props, recursiveRender(containers, props, index + 1));
    }
  } else {
    return props.children;
  }
};
export const composeContainers = (containerMap, containerIds, components) => {
  let CompositeContainer = ({
    children
  }) => children;

  if (Array.isArray(containerIds)) {
    const containers = containerIds.map(id => {
      return ({
        children,
        ...data
      }) => React.createElement(Component, _extends({
        id: id,
        data: data,
        components: components
      }, containerMap.get(id)), children);
    });

    CompositeContainer = props => recursiveRender(containers, props);
  }

  return memo(CompositeContainer);
};
export default composeContainers;