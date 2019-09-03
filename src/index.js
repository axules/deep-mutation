function XMutateRemovedElementX() {}
function XMutateLockedElementX(value) {
  this.__value__ = value;
}
function XDeepPatchX(value) {
  this.__value__ = value;
}
function XIssetMarkerX() {}

const ARRAY_REGEXP = new RegExp('^\\[([^\\[\\].]*)\\]$');

const MUTATE_TYPES = {
  ARRAY: 'array',
  OBJECT: 'object',
  DEFAULT: ''
};

function mutateObj(point, vType) {
  if (!point) return vType === MUTATE_TYPES.ARRAY ? [] : {};
  if (Array.isArray(point)) return [].concat(point);
  if (vType === MUTATE_TYPES.ARRAY) return [];
  if (checkIsObject(point)) return Object.assign({}, point);
  if (vType === MUTATE_TYPES.OBJECT) return {};
  return point;
}

export function getObjectPaths(obj, prefix = [], map = null) {
  if (!checkIsNativeObject(obj)) return [];

  const keys = Object.keys(obj);
  const isRoot = !map;
  const myMap = isRoot
    // eslint-disable-next-line no-undef
    ? new Map()
    : map;

  // ignore objects that were listened. It means that recursive links will be ignored
  if (myMap.has(obj)) return null;
  myMap.set(obj, new XIssetMarkerX());

  for (let i = 0; i < keys.length; i++) {
    const value = obj[keys[i]];
    const currentPath = prefix.concat([keys[i]]);
    if (checkIsNativeObject(value)) {
      getObjectPaths(value, currentPath, myMap);
    } else {
      const containsDot = currentPath.some(el => el.indexOf('.') >= 0);
      myMap.set(containsDot ? currentPath : currentPath.join('.'), value);
    }
  }

  if (isRoot) {
    const result = [];
    myMap.forEach(function(val, key) {
      if (val instanceof XIssetMarkerX) return false;
      result.push([key, val]);
    });
    return result;
  }
  return null;
}

export function extToArray(pExt) {
  let result = pExt;
  if (!Array.isArray(pExt)) {
    if (checkIsDeepPatch(pExt)) result = [pExt];
    else {
      if (!checkIsNativeObject(pExt)) return [];
      const keys = Object.keys(pExt || {});
      result = keys.map(function (key) {
        return (
          pExt[key] === undefined
            ? [key]
            : [key, pExt[key]]
        );
      });
    }
  }

  return result.reduce(function (R, pair) {
    const isDeep = checkIsDeepPatch(pair);
    if (!isDeep && (!pair || pair.length < 2)) return R;

    const pairVal = isDeep ? pair : getPairValue(pair);
    if (isDeep || checkIsDeepPatch(pairVal)) {
      const pairPath = isDeep || !pair[0] ? undefined : splitPath(pair[0]);
      const n = R.findIndex(el => el === pair);
      if (n < 0) return R;

      return R.slice(0, n)
        .concat(
          getObjectPaths(pairVal.__value__, pairPath),
          R.slice(n + 1)
        );
    }
    return R;
  }, result);
}

export function separatePath(path) {
  return typeof(path) == 'string'
    ? path.replace( new RegExp('([^\\.])(\\[)', 'g'), function (match, p1, p2) {
      return p1 + '.' + p2;
    })
    : path;
}

export function splitPath(path) {
  if (typeof(path) == 'string') return path.split('.');
  if (Array.isArray(path)) return path;
  throw new Error('Path should be String or Array of Strings');
}

function setValue(parent, key, value) {
  const isRemove = checkIsRemoved(value);
  const isUndefinedKey = key === undefined;
  if (isRemove && (isUndefinedKey || !parent.hasOwnProperty(key))) {
    return parent;
  }

  const isLocked = checkIsLocked(parent);
  if (isUndefinedKey) {
    if (isLocked) parent.__value__ = value;
    else return value;
  } else {
    const realParent = isLocked ? parent.__value__ : parent;
    if (isRemove) {
      if (Array.isArray(realParent)) realParent.splice(key, 1);
      else delete realParent[key];
    } else realParent[key] = value;
  }

  return parent;
}

function checkIsRemoved(pObj) {
  return pObj instanceof XMutateRemovedElementX;
}

function checkIsLocked(pObj) {
  return pObj instanceof XMutateLockedElementX;
}

function checkIsDeepPatch(value) {
  return value instanceof XDeepPatchX;
}

function checkIsObject(value) {
  return value && typeof(value) === 'object';
}

function checkIsNativeObject(value) {
  return checkIsObject(value) && value.__proto__.constructor.name === 'Object';
}
// It has been exported for tests, but you could use it if needed
export function checkIsExists(pObject, pPath) {
  return getValue(pObject, pPath) !== undefined;
}

export function getValue(pObject, pPath) {
  if (!(pObject instanceof Object)) return undefined;

  const pieces = splitPath(pPath);
  if (pieces.length === 0) return pObject;

  function preparePiece(piece) {
    return piece.replace(/(\[|\])+/g, '');
  }

  const lastIndex = pieces.length - 1;
  let node = pObject;
  for (let i = 0; i < lastIndex; i++) {
    const piece = preparePiece(pieces[i]);
    node = checkIsLocked(node[piece])
      ? node[piece].__value__
      : node[piece];
    if (!node || !checkIsObject(node) || checkIsRemoved(node)) return undefined;
  }

  return node[preparePiece(pieces[lastIndex])];
}

export function isArrayElement(value) {
  return ARRAY_REGEXP.test(value);
}

export function getPairValue(pair) {
  if (!Array.isArray(pair) || pair.length === 0) return undefined;
  const valueIndex = pair.length - 1 || 1;
  return pair[valueIndex];
}

function extToTree(pExt, pSource) {
  // +++++++++++++++++++++++++++
  function getNewValue(pair, isMutated) {
    if (!pair || pair.length === 0) return undefined;

    if (pair.length === 1) {
      return new XMutateRemovedElementX();
    }

    const pairValue = getPairValue(pair);
    if (!isMutated && checkIsObject(pairValue)) {
      return new XMutateLockedElementX(pairValue);
    }

    return pairValue;
  }
  // +++++++++++++++++++++++++++
  if (!checkIsObject(pExt)) throw new Error('Changes should be Object or Array');
  const values = extToArray(pExt);

  return values.reduce(function (FULL_RESULT, PAIR) {
    if (!PAIR) return FULL_RESULT;
    if (typeof(PAIR) === 'string') PAIR = [PAIR];
    if (!PAIR[0] && PAIR[0] !== 0) {
      throw new Error('Path should not be empty');
    }

    const pathPieces = splitPath(separatePath(PAIR[0]));
    if (PAIR.length < 2 || getPairValue(PAIR) === undefined) {
      if (!(checkIsExists(pSource, pathPieces) || checkIsExists(FULL_RESULT, pathPieces))) {
        return FULL_RESULT;
      }
    } else {
      const currentValue = getValue(pSource, pathPieces);
      if (currentValue === getPairValue(PAIR)) return FULL_RESULT;
    }

    let isLockedPath = false;
    pathPieces.reduce(function (parent, currentKey, currentI) {
      const isLastPiece = currentI >= pathPieces.length - 1;
      const actualKey = currentKey === '[]'
        ? '[+' + String(Math.random()).slice(2, 12) + ']'
        : currentKey;

      const newKey = isLockedPath
        ? getOptions(actualKey, parent).realKey
        : actualKey;

      const isLockedCurrent = !isLockedPath
        && parent.hasOwnProperty(newKey)
        && checkIsLocked(parent[newKey]);

      isLockedPath = isLockedPath || isLockedCurrent;

      if (isLastPiece) {
        const newValue = getNewValue(PAIR, isLockedPath);
        if (isLockedPath) setValue(parent, newKey, newValue);
        else parent[newKey] = newValue;
        return FULL_RESULT;
      }

      const currentValue = (
        isLockedCurrent
          ? parent[newKey].__value__
          : parent[newKey]
      );

      if (!checkIsObject(currentValue)) {
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

function updateSection(point, tree) {
  if (
    !tree
    || Array.isArray(tree)
    || !checkIsObject(tree)
  ) return tree;

  if (checkIsLocked(tree)) return tree.__value__;

  const pieces = Object.keys(tree);
  const needArray = pieces.some(isArrayElement);
  const result = mutateObj(point, needArray ? MUTATE_TYPES.ARRAY : MUTATE_TYPES.OBJECT);

  pieces.forEach(function (key) {
    const opt = getOptions(key, result);
    const k = opt.realKey;
    if (checkIsRemoved(tree[key])) {
      if (opt.isArray) result.splice(k, 1);
      else delete result[k];
      // setValue(result, k, tree[key]);
    } else {
      result[k] = updateSection(result[k], tree[key]);
    }
  });
  return result;
}

export function getOptions(key, parentValue) {
  const realParentValue = checkIsLocked(parentValue)
    ? parentValue.__value__
    : parentValue;
  const parse = ARRAY_REGEXP.exec(key);
  const result = {
    key: key,
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

function mutate(pObj, pExt) {
  if (!checkIsObject(pObj)) {
    throw new Error('Type of variable shoud be Object or Array');
  }

  if (typeof(pExt) === 'undefined') {
    return toFunction(pObj);
  }

  const tree = extToTree(pExt, pObj);
  if (Object.getOwnPropertyNames(tree).length === 0) {
    return pObj;
  }
  return updateSection(pObj, tree);
}

export function deepPatch(pExt) {
  if (checkIsDeepPatch(pExt)) return pExt;
  return new XDeepPatchX(pExt);
}

mutate.deep = function (pObj, pExt) {
  let newExt = null;
  if (Array.isArray(pExt)) {
    newExt = pExt.map(el => deepPatch(el));
  } else newExt = deepPatch(pExt);

  return mutate(pObj, newExt);
};

function toFunction(pObj) {
  var result = pObj;

  return function(pExt) {
    if (typeof(pExt) === 'undefined') return result;
    result = mutate(result, pExt);
    return result;
  };
}

export default mutate;