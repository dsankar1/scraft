export { default as composeContainers } from './composeContainers';
export { default as funcifyHandlers } from './funcifyHandlers';
export { default as reinterpolate } from './reinterpolate';
export const objArrayToMap = (objArray, primaryKey = 'id') => {
  const objMap = new Map();

  if (Array.isArray(objArray)) {
    objArray.forEach(obj => {
      if (typeof obj === 'object' && obj != null) {
        objMap.set(obj[primaryKey], obj);
      }
    });
  }

  return objMap;
};