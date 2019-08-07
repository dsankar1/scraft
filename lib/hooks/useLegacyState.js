import { useState, useMemo } from 'react';
export default (initState => {
  const [state, replaceState] = useState(initState);
  const setState = useMemo(() => {
    return updates => replaceState(state => ({ ...state,
      ...updates
    }));
  }, [replaceState]);
  return [state, setState];
});