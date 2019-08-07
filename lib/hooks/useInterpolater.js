import { useState, useRef } from 'react';
import { reinterpolate, funcifyHandlers } from '../utils';
export default ((target, data, handlerKey = 'handlers') => {
  const [handlers, setHandlers] = useState(funcifyHandlers(target, data, handlerKey));
  const isMounted = useRef(false);

  if (isMounted.current) {
    const handlersTemp = funcifyHandlers(target, data, handlerKey);

    if (handlersTemp.deps.size !== handlers.deps.size) {
      setHandlers(handlersTemp);
    } else {
      for (const [key, dep] of handlersTemp.deps) {
        if (!handlers.deps.has(key) || dep !== handlers.deps.get(key)) {
          setHandlers(handlersTemp);
          break;
        }
      }
    }
  } else {
    isMounted.current = true;
  }

  return reinterpolate(target, { ...data,
    [handlerKey]: handlers.funcs
  });
});