import * as _ from 'lodash';

export function convertSnakeCaseKeysToCamelCase<T1, T2>(object: T1): Partial<T2> {
  const newObject = {};

  for (const key in object) {
    const updatedKey = _.camelCase(key);
    newObject[updatedKey] = object[key];
  }

  return newObject;
}

export function pick<T1>(object: T1, array: Array<string>): Partial<T1> {
  return _.pick(object, array);
}

export function cloneDeep<T1>(object: T1): Partial<T1> {
  return _.cloneDeep(object);
}
