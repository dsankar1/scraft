/**
 * Composes the provided value with each of the functions.
 * @param {*} value value which will be composed by the functions
 * @param  {...function} functions list of compositional functions
 */
const compose = (value, ...functions) => {
  functions.forEach(func => {
    value = func(value);
  });
  return value;
};
/**
 * In the case of a target of type object, this function will recursively apply the compose
 * function to each of it's attributes. If the provded target isn't an object, it behaves exactly
 * like the non-recursive compose function.
 * @param {*} target value which will be (recursively if type obj) composed by the functions
 * @param  {...function} functions list of compositional functions
 */


export const recompose = (target, ...functions) => {
  // null is considered an object type, so additional check needed
  if (typeof target === 'object' && target != null) {
    if (Array.isArray(target)) {
      return target.map(value => {
        // null is considered an object type, so additional check needed
        if (typeof value === 'object' && value != null) {
          return recompose(value, ...functions);
        } else {
          return compose(value, ...functions);
        }
      });
    } else {
      const result = {};
      Object.keys(target).forEach(key => {
        const value = target[key]; // null is considered an object type, so additional check needed

        if (typeof value === 'object' && value != null) {
          result[key] = recompose(value, ...functions);
        } else {
          result[key] = compose(value, ...functions);
        }
      });
      return result;
    }
  } else {
    return compose(target, ...functions);
  }
};
export default recompose;