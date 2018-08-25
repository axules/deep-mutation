export function diffToHtml(diff) {
  return diff
    .map(el => `<div class='${el[1] ? 'equal' : 'notEqual'}'>${el[0]}</div>`)
    .join('');
}

export default function deepDiffEqual(a, b, prefix = '') {
  if (!(a instanceof Object)) return null;
  const isArray = Array.isArray(a);
  return (isArray ? a : Object.keys(a)).reduce((R, key) => {
    const currentKey = isArray
      ? `${prefix}${prefix ? '.' : ''}[${key}]`
      : `${prefix}${prefix ? '.' : ''}${key}`;
    R.push([currentKey, a[key] === b[key]]);
    if (a[key] instanceof Object) {
      return R.concat(deepDiffEqual(a[key], b[key], currentKey));
    }
    return R;
  }, []);
}
