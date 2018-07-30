function XMutateRemovedElementX() {}
function XMutateLockedElementX(value) {
  this.__value__ = value;
}

const ARRAY_REGEXP = new RegExp('^\\[([^\\[\\].]*)\\]$');
/* ############################################################################# */
const mutateTypes = {
  array: 'array',
  object: 'object',
  default: ''
};
/* ############################################################################# */
function mutateObj(point, vType = mutateTypes.default) {
  if (!point) return vType === mutateTypes.array ? [] : {};
  if (Array.isArray(point)) return point.slice(0);
  if (vType === mutateTypes.array) return [];
  if (typeof (point) === 'object') return Object.assign({}, point);
  if (vType === mutateTypes.object) return {};
  return point;
}
/* ############################################################################# */
function extToArray(pExt) {
  if (Array.isArray(pExt)) return pExt;
  const keys = Object.keys(pExt || {});
  return keys.map( key => 
    pExt[key] === undefined 
      ? [key] 
      : [key, pExt[key]]
  );
}
/* ############################################################################# */
function separatePath(path) {
  return path.replace(
    new RegExp('([^\\.])(\\[)', 'g'), 
    function (match, p1, p2) {
      return p1 + '.' + p2;
    } 
  );
}
/* ############################################################################# */
function setValue(parent, key, value) {
  const isLocked = checkIsLocked(parent);
  const isRemove = value instanceof XMutateRemovedElementX;
  const isUKey = key === undefined;
  const isHasKey = key ? parent.hasOwnProperty(key) : true;
  
  if (isRemove && isUKey) return parent;
  if (isRemove && !isHasKey) return parent;
  if (isUKey) {
    if (isLocked) parent.__value__ = value;
    else return value;
  } else {
    const realParent = isLocked ? parent.__value__ : parent;
    if (isRemove) {
      if (Array.isArray(realParent)) realParent.slice(key, 1);
      else delete realParent[key];
    } else realParent[key] = value;
  }

  return parent;
}
/* ############################################################################# */
function checkIsLocked(obj) {
  return obj instanceof XMutateLockedElementX;
}
/* ############################################################################# */
function extToTree(pExt) {
  // +++++++++++++++++++++++++++
  function pairValue(pair, isMutated) {
    if (pair.length === 1) {
      return new XMutateRemovedElementX();
    }

    if (
      !isMutated 
      && pair[1] instanceof Object 
    ) return new XMutateLockedElementX(pair[1]);

    return pair[1];
  }
  // +++++++++++++++++++++++++++
  if (!(pExt instanceof Object)) throw new Error('Changes should be Object or Array');
  const values = extToArray(pExt);
  return values.reduce((FULL_RESULT, PAIR) => {
    if (!PAIR) return FULL_RESULT;
    if (typeof(PAIR) === 'string') PAIR = [PAIR];
    if (!PAIR[0] && PAIR[0] !== 0) throw new Error('Path should not be empty');

    const pieces = separatePath(PAIR[0]).split('.');
    
    let isLockedPath = false;
    pieces.reduce((parent, currentKey, currentI) => {
      const isLastPiece = currentI >= pieces.length - 1;
      const generatedKey = currentKey === '[]'
        ? `[+${String(Math.random()).slice(2, 12)}]`
        : currentKey;
      const newKey = isLockedPath 
        ? getOptions(generatedKey, parent).realKey 
        : generatedKey;

      const isLockedCurrent = !isLockedPath 
        && parent.hasOwnProperty(newKey) 
        && checkIsLocked(parent[newKey]);

      isLockedPath = isLockedPath || isLockedCurrent;

      if (isLastPiece) {
        const newValue = pairValue(PAIR, isLockedPath);
        if (isLockedPath) setValue(parent, newKey, newValue);
        else parent[newKey] = newValue;
        return FULL_RESULT;
      }

      const currentValue = (
        isLockedCurrent 
          ? parent[newKey].__value__ 
          : parent[newKey]
      );

      if (!(currentValue instanceof Object)) {
        // if (!!currentValue) {
        //   console.warn(`Warning: In "${PAIR[0]}", bad value for "${currentKey}", it will be replaced by empty Object ({})`);
        // }
        const newValue = {};
        if (isLockedPath) setValue(parent, newKey, newValue);
        else parent[newKey] = newValue;
        return newValue;
      }

      return currentValue;
    }, FULL_RESULT);
    return FULL_RESULT;
  }, {});
}
/* ############################################################################# */
function updateSection(point, tree) {
  if (
    !tree || 
    Array.isArray(tree) || 
    typeof (tree) !== 'object'
  ) return tree;

  if (checkIsLocked(tree)) return tree.__value__;

  const pieces = Object.keys(tree).map(k => k.trim());
  const needArray = pieces.some(p => !!ARRAY_REGEXP.exec(p));
  const result = mutateObj(point, needArray ? mutateTypes.array : mutateTypes.object);

  pieces.forEach(key => {
    const opt = getOptions(key, result);
    const k = opt.realKey;
    if (tree[key] instanceof XMutateRemovedElementX) {
      if (opt.isArray) result.splice(k, 1);
      else delete result[k];
      // setValue(result, k, tree[key]);
    } else {
      result[k] = updateSection(result[k], tree[key]);
    }
  });
  return result;
}
/* ############################################################################# */
export function getOptions(key, parentValue) {
  const realParentValue = checkIsLocked(parentValue)
    ? parentValue.__value__
    : parentValue;
  const parse = ARRAY_REGEXP.exec(key);
  const result = {
    key,
    realKey: key,
    isArray: !!parse,
    length: Array.isArray(realParentValue) ? realParentValue.length : 0
  };
  
  if (parse) {
    const k = parse[1].trim();
    result.key = k;
    if (k === '' || k.slice(0,1) === '+') {
      result.realKey = result.length;
    } else {
      result.realKey = parseInt(k, 10) || 0;
    }
  }

  return result;
}
/* ############################################################################# */
export default function mutate(pObj, pExt) {
  if (typeof (pObj) !== 'object') {
    throw new Error('Type of variable shoud be Object or Array');
  }
  const tree = extToTree(pExt);
  return updateSection(pObj, tree);
}
/* ############################################################################# */

