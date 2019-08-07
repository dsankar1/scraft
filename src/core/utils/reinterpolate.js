/* eslint-disable no-template-curly-in-string */
import { recompose } from './recompose';

const BASE = '([a-zA-Z1-9.]+)?';

/**
 * Queries a value from the provided data which corresponds to the query string.
 * @param {*} qs query string which conforms to the regex \${[a-zA-Z1-9.]+}
 * @param {*} data source of data to get interpolation values from
 * @returns {*} value from data which corresponds to the query
 */
export const query = (qs, data, config = {}) => {
    const { start = '${', end = '}' } = config;

    qs = qs.trim();
    qs = qs.substring(start.length, qs.length - end.length);

    let result = data;
    // make sure qs matches the template format
    if (new RegExp(BASE).test(qs)) {
        const keychain = qs.split('.');
        // console.log('Keychain', keychain);
        for (const key of keychain) {
            if (typeof result === 'object' && result != null) {
                result = result[key];
            } else {
                result = undefined;
                break;
            }
        }
    }
    return result;
};

export const interpolate = (
    value,
    data = {},
    config = {},
    deps = new Map()
) => {
    let ivalue = value;
    if (typeof value === 'string') {
        let {
            // query start delimiter
            start = '\\${',
            // query end delimiter
            end = '}',
            // only interpolate queries starting with this
            prefix = [''],
            // queries that return undefined are left as queries
            ignoreUndefined
        } = config;

        // convert prefix to an array and iterate
        prefix = Array.isArray(prefix) ? prefix : [prefix];
        for (const pfx of prefix) {
            const template = start + pfx + BASE + end;
            const regex = new RegExp(template, 'g');

            // find every query match in string
            let match = regex.exec(value);
            while (match) {
                const qs = match[0];
                // query the data object if qs isn't already in deps
                if (!deps.has(qs)) {
                    deps.set(qs, query(qs, data, config));
                }
                const qv = deps.get(qs);

                if (!ignoreUndefined || qv !== undefined) {
                    if (value.trim() === qs) {
                        ivalue = qv;
                    } else {
                        ivalue = ivalue.replace(qs, qv);
                    }
                }

                match = regex.exec(value);
            }
        }
    }
    return ivalue;
};

export const reinterpolate = (target, data, deps = new Map()) => {
    if (typeof data === 'object') {
        return recompose(target, value => {
            return interpolate(
                value,
                data,
                { prefix: Object.keys(data) },
                deps
            );
        });
    }
    return target;
};

export default reinterpolate;
