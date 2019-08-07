import { useState, useEffect, useRef } from 'react';
import build from '../build';

export default (config, components, utils) => {
    const [App, setApp] = useState(build(config, components, utils));
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            setApp(() => build(config, components, utils));
        } else {
            isMounted.current = true;
        }
    }, [config, components, utils]);

    return App;
};
