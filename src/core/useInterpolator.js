import _ from 'lodash';
import React from 'react';
import { useStore, useDispatch } from 'react-redux';
import reinterpolate from './reinterpolate';

const omitPaths = ['initState', 'chunks', 'funcs', 'onMount', 'onUnmount', 'onUpdate'];

const getEmbeddedFuncKeys = funcDef => {
    const embeddedFuncsMap = new Map();
    reinterpolate(funcDef, { funcs: {} }, undefined, embeddedFuncsMap);
    return _.map(Array.from(embeddedFuncsMap.keys()), funcQuery => {
        return _.trimEnd(_.replace(funcQuery, '${funcs.', ''), '}');
    });
}

const aggregateEmbeddedDeps = (funcDef, funcDefs, data, defaultValue, deps = new Map()) => {
    const iFuncDef = reinterpolate(funcDef, data, defaultValue, deps);
    const embeddedFuncKeys = getEmbeddedFuncKeys(funcDef);
    _.forEach(embeddedFuncKeys, embeddedFuncKey => {
        const embeddedFuncDef = _.get(funcDefs, embeddedFuncKey);
        aggregateEmbeddedDeps(embeddedFuncDef, funcDefs, data, defaultValue, deps);
    });
    return iFuncDef;
}

export const useInterpolator = (props, data, defaultValue) => {
    const [state, replaceState] = React.useState(_.get(props, 'initState'));
    const setState = React.useCallback(update => {
        replaceState(state => _.defaults(update, state));
    }, [replaceState]);

    const store = _.attempt(_.attempt(useStore).getState);
    const dispatch = _.attempt(useDispatch);

    const prevFuncMap = React.useRef(new Map());
    const prevFuncDepMap = React.useRef(new Map());

    const interpolated = React.useMemo(() => {
        const aggrData =  _.defaults({
            _,
            props,
            state,
            setState,
            store,
            dispatch,
            chunks: _.get(props, 'chunks')
        }, data);

        const funcDefs = _.get(props, 'funcs');

        const funcs = _.transform(funcDefs, (accumulator, funcDef, funcKey) => {
            const funcDeps = new Map();
            const iFuncDef = aggregateEmbeddedDeps(funcDef, funcDefs, aggrData, defaultValue, funcDeps);
            const prevFuncDeps = prevFuncDepMap.current.get(funcKey);

            let func = prevFuncMap.current.get(funcKey);

            if (!_.isEqual(funcDeps, prevFuncDeps)) {
                func = (...params) => {
                    const payload = _.get(params, 0);
                    const results = [];
                    let result;

                    const iiFuncDef = reinterpolate(iFuncDef, { funcs, params, payload }, defaultValue);
                    if (_.isArray(iiFuncDef)) {
                        _.forEach(iiFuncDef, (subFunc, index) => {
                            const iSubFunc = reinterpolate(subFunc, { results, result }, defaultValue);
                            result = _.attempt(iSubFunc.func, ..._.concat(iSubFunc.params));
                            if (_.isError(result)) {
                                console.error(`Error occurred in funcs.${funcKey}[${index}]\n`, result);
                            }
                            results.push(result);
                        });
                    } else if (_.isObjectLike(iiFuncDef)) {
                        result = _.attempt(iiFuncDef.func, ..._.concat(iiFuncDef.params));
                        if (_.isError(result)) {
                            console.error(`Error occurred in funcs.${funcKey}\n`, result);
                        }
                    }
                    return result;
                }

                const funcDepMap = _.clone(prevFuncDepMap.current);
                const funcMap = _.clone(prevFuncMap.current);

                funcDepMap.set(funcKey, funcDeps);
                funcMap.set(funcKey, func);

                prevFuncDepMap.current = funcDepMap;
                prevFuncMap.current = funcMap;
            }
            _.set(accumulator, funcKey, func);
        }, {});

        return reinterpolate(props, _.defaults({ funcs }, aggrData), defaultValue);
    }, [props, state, setState, store, dispatch, data, defaultValue]);

    React.useEffect(() => {
        if (_.isFunction(interpolated.onMount)) {
            _.attempt(interpolated.onMount);
        }
        return () => {
            if (_.isFunction(interpolated.onUnmount)) {
                _.attempt(interpolated.onUnmount);
            }
        }
    }, []);

    const prevProps = React.useRef(props);
    const prevState = React.useRef(state);
    const prevStore = React.useRef(store);

    React.useEffect(() => {
        if (_.isFunction(interpolated.onUpdate)) {
            _.attempt(interpolated.onUpdate, {
                prevProps: prevProps.current,
                prevState: prevState.current,
                prevStore: prevStore.current
            });
        }
        prevProps.current = _.clone(props);
        prevState.current = _.clone(state);
        prevStore.current = _.clone(store);
    }, [props, state, store, interpolated.onUpdate]);

    return _.omit(interpolated, omitPaths);
}

export default useInterpolator;
