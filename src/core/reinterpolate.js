import _ from 'lodash';

export const propertyPathRegex = '[_a-zA-Z0-9.\\[\\]]+';

export const interpolate = (target, data, defaultValue, deps = new Map()) => {
    let interpolated = target;

    if (_.isString(target) && _.isObjectLike(data)) {
        let match;
        let firstPropertyRegex = '';
        const properties = _.keys(data);

        if (_.size(properties) > 0) {
            firstPropertyRegex = `(${_.join(properties, '|')})`;
        }
        const propertyPathQueryRegex = new RegExp(`\\$\\{(\\!|\\+)?${firstPropertyRegex}(${propertyPathRegex})?\\}`, 'g');

        while ((match = propertyPathQueryRegex.exec(target)) !== null) {
            const propertyPathQuery = _.get(match, 0, '');
            let propertyValue = deps.get(propertyPathQuery);

            if (_.isUndefined(propertyValue)) {
                const propertyPath = _.get(propertyPathQuery.match(propertyPathRegex), 0);
                propertyValue = _.get(data, propertyPath, defaultValue);
                const hasExclamation = _.includes(propertyPathQuery, '!');
                const hasPlus = _.includes(propertyPathQuery, '+');
                
                if (hasExclamation) {
                    propertyValue = !propertyValue;
                } else if (hasPlus) {
                    propertyValue = +propertyValue;
                }
                deps.set(propertyPathQuery, propertyValue);
            }

            if (_.isEqual(propertyPathQuery, _.trim(interpolated))) {
                interpolated = propertyValue;
            } else {
                interpolated = interpolated.replace(propertyPathQuery, propertyValue);
            }
        }
    }
    return interpolated;
}

export const reinterpolate = (target, data, defaultValue, deps = new Map()) => {
    let interpolated = target;
    
    if (_.isObjectLike(data)) {
        if (_.isObjectLike(target)) {
            interpolated = _.transform(target, (acc, value, key) => {
                _.set(acc, key, reinterpolate(value, data, defaultValue, deps));
            }, _.clone(target));
        } else if (_.isString(target)) {
            interpolated = interpolate(target, data, defaultValue, deps);
        }   
    }
    return interpolated;
}

export default reinterpolate;
