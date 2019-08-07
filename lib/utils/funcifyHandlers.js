import reinterpolate from './reinterpolate';
export const funcifyHandler = (handler, handlerKey) => {
  return initialInput => {
    if (Array.isArray(handler)) {
      let input = initialInput;
      handler.forEach(part => {
        if (typeof part.function === 'function') {
          const result = part.function(...reinterpolate(part.parameters, {
            initialInput,
            input
          }));

          if (result !== undefined) {
            input = result;
          }
        } else {
          console.error(`${handlerKey}: error while processing handler`);
        }
      });
      return input;
    }
  };
};
export const funcifyHandlers = (target, data, handlerKey) => {
  const funcs = {};
  const deps = new Map();
  const handlers = reinterpolate(target[handlerKey], data, deps);

  if (typeof handlers === 'object' && handlers != null) {
    Object.keys(handlers).forEach(key => {
      const handler = reinterpolate(handlers[key], {
        [handlerKey]: funcs
      });
      funcs[key] = funcifyHandler(handler, key);
    });
  }

  return {
    funcs,
    deps
  };
};
export default funcifyHandlers;