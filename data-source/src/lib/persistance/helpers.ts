export function flattenObject(obj: any, prefix = '', result: any = {}) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], `${prefix}${key}.`, result);
    } else {
      result[prefix + key] = obj[key];
    }
  }
  return result;
}
