export const CONFIG = {
  reportFunctionMutation: false,
  reportIncompatibleObjectType: false,
};

export function XMutateRemovedElementX() {}
export function XMutateLockedElementX(value) {
  this.__value__ = value;
}
function XDeepPatchX(value) {
  this.__value__ = value;
}
function XIssetMarkerX() {}

const ARRAY_REGEXP = new RegExp('^\\[([^\\[\\]]*)]$');

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
    } else if (checkIsDeepPatch(value)) {
      getObjectPaths(value.__value__, currentPath, myMap);
    } else {
      const containsDot = currentPath.some(function (el) { return el.indexOf('.') >= 0 });
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
    if (checkIsDeepPatch(pExt)) {
      result = [pExt];
    } else {
      if (!checkIsNativeObject(pExt)) {
        console.error(new Error('Changes should be Object or Array'));
        return [];
      }
      
      result = Object.keys(pExt || {})
        .map((key) => (checkIsUndefined(pExt[key]) ? [key] : [key, pExt[key]]));
    }
  }

  return result.reduce(function (R, pair) {
    const isDeep = checkIsDeepPatch(pair);
    if (!isDeep && (!pair || pair.length < 2)) {
      return R;
    }

    const pairVal = isDeep ? pair : pair[1];
    if (isDeep || checkIsDeepPatch(pairVal)) {
      const pairPath = isDeep || !pair[0] ? undefined : splitPath(pair[0]);
      const n = R.findIndex((el) => el === pair);
      if (n < 0) return R;

      return R.slice(0, n).concat(getObjectPaths(pairVal.__value__, pairPath), R.slice(n + 1));
    }
    return R;
  }, result);
}

export function separatePath(path) {
  return checkIsString(path)
    ? path.replace(new RegExp('([^.])(\\[)', 'g'), (match, p1, p2) => `${p1}.${p2}`)
    : path;
}

export function splitPath(path) {
  if (checkIsString(path)) return path.split('.');
  // .split(/(?<!\[[^\]]*)\.(?![^\[]*\])/)
  if (Array.isArray(path)) return path;
  throw new Error('Path should be String or Array of Strings');
}

function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function setValue(parent, key, value) {
  const isArrayInsert = key && String(key).startsWith('[>');
  const isRemove = checkIsRemoved(value);

  if (isRemove && (isArrayInsert || !hasProperty(parent, key))) {
    return parent;
  }

  const realParent = checkIsLocked(parent) ? parent.__value__ : parent;

  if (isRemove) {
    if (Array.isArray(realParent)) realParent.splice(key, 1);
    else delete realParent[key];
    return parent;
  }

  if (isArrayInsert) {
    const index = parseInt(key.slice(2).replace(']', ''), 10);
    realParent.splice(index, 0, value);
    return parent;
  }

  realParent[key] = value;

  return parent;
}

function checkIsUndefined(value) {
  return typeof(value) === 'undefined';
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

function checkIsString(value) {
  return typeof(value) === 'string';
}

function checkIsFunction(value) {
  return value && typeof(value) === 'function';
}

function checkIsNativeObject(value) {
  return checkIsObject(value) && value.__proto__.constructor.name === 'Object';
}
// It has been exported for tests, but you could use it if needed
export function checkIsExists(pObject, pPath) {
  return !checkIsUndefined(getValue(pObject, pPath));
}

export function getValue(pObject, pPath) {
  if (!pObject || !checkIsObject(pObject)) return undefined;

  const pieces = splitPath(pPath);
  if (pieces.length === 0) return pObject;

  // function preparePiece(piece) {
  //   return piece.replace(/(\[|\])+/g, '');
  // }

  const lastIndex = pieces.length - 1;
  let node = pObject;
  for (let i = 0; i < lastIndex; i += 1) {
    const piece = getRealIndex(node, pieces[i]);
    node = checkIsLocked(node[piece]) ? node[piece].__value__ : node[piece];
    if (!node || !checkIsObject(node) || checkIsRemoved(node)) {
      return undefined;
    }
  }

  return node[getRealIndex(node, pieces[lastIndex])];
}

export function isArrayElement(key) {
  return checkIsString(key) && ARRAY_REGEXP.test(key);
}

export function extToTree(pExt, pSource) {
  let arrayCounter = 100;
  // +++++++++++++++++++++++++++
  function getNewValue(pair, isMutated) {
    if (!pair || pair.length === 0) return undefined;

    if (pair.length === 1 || checkIsUndefined(pair[1])) {
      return new XMutateRemovedElementX();
    }

    if (!isMutated && checkIsObject(pair[1])) {
      return new XMutateLockedElementX(pair[1]);
    }

    return pair[1];
  }
  // +++++++++++++++++++++++++++
  if (!checkIsObject(pExt)) {
    throw new Error('Changes should be Object or Array');
  }
  const values = extToArray(pExt);

  return values.reduce(function (FULL_RESULT, PAIR) {
    if (!PAIR) return FULL_RESULT;
    if (checkIsString(PAIR)) PAIR = [PAIR];
    if (!PAIR[0] && PAIR[0] !== 0) {
      throw new Error('Path should not be empty');
    }

    const pathPieces = splitPath(separatePath(PAIR[0]));
    if (PAIR.length < 2 || checkIsUndefined(PAIR[1])) {
      if (!(checkIsExists(pSource, pathPieces) || checkIsExists(FULL_RESULT, pathPieces))) {
        return FULL_RESULT;
      }
    } else if (getValue(pSource, pathPieces) === PAIR[1]) {
      return FULL_RESULT;
    }

    let isLockedPath = false;
    // console.log('--------------------');
    pathPieces.reduce(function (parent, currentKey, currentI) {
      const isLastPiece = currentI >= pathPieces.length - 1;
      const actualKey = currentKey === '[]' ? `[+${++arrayCounter}]` : currentKey;
      const newKey = isLockedPath ? getOptions(parent, actualKey).realKey : actualKey;

      const isLockedCurrent = !isLockedPath
        && hasProperty(parent, newKey)
        && checkIsLocked(parent[newKey]);

      isLockedPath = isLockedPath || isLockedCurrent;

      if (isLastPiece) {
        const newValue = getNewValue(PAIR, isLockedPath);
        if (isLockedPath) setValue(parent, newKey, newValue);
        else parent[newKey] = newValue;
        // return ROOT of changes
        return FULL_RESULT;
      }

      const currentValue = isLockedCurrent ? parent[newKey].__value__ : parent[newKey];

      if (!checkIsObject(currentValue)) {
        if (currentValue && CONFIG.reportIncompatibleObjectType) {
          console.error(new Error(`Warning: In "${PAIR[0]}", bad value for "${currentKey}", it will be replaced by empty Object ({})`));
        }
        const newValue = {};
        if (isLockedPath) setValue(parent, newKey, newValue);
        else parent[newKey] = newValue;

        // return new position in tree
        return newValue;
      }

      // return current position in tree
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
  ) {
    return tree;
  }

  if (checkIsFunction(tree)) {
    if (CONFIG.reportFunctionMutation) {
      console.error(new Error('Function mutation'));
    }
    return tree(point);
  }

  if (checkIsLocked(tree)) return tree.__value__;

  const pieces = Object.keys(tree);
  const needArray = pieces.some(isArrayElement);
  const result = mutateObj(point, needArray ? MUTATE_TYPES.ARRAY : MUTATE_TYPES.OBJECT);

  pieces.forEach(function (key) {
    const opt = getOptions(result, key);
    const k = opt.realKey;
    
    if (checkIsRemoved(tree[key])) {
      if (opt.isArray) result.splice(k, 1);
      else delete result[k];
      return;
    }

    if (key && String(key).startsWith('[>')) {
      const index = parseInt(key.slice(2).replace(']',''), 10);
      result.splice(index, 0, updateSection(result[index], tree[key]));
      return;
    }

    if (!opt.isArray || k >= 0) {
      result[k] = updateSection(result[k], tree[key]);
    }
  });
  return result;
}

export function getRealIndex(items, key) {
  const parse = key ? ARRAY_REGEXP.exec(key) : null;
  if (!parse) return key;

  const k = parse[1].trim();

  if (k.startsWith('>')) {
    // [>2] || [>2...]
    return k;
  }

  const arrayItems = Array.isArray(items) ? items : [];

  if (k.length == 0 || k.startsWith('+')) {
    return arrayItems.length;
  }

  if (k.startsWith('=')) {
    // [=10] || [=id=99]
    const parseCompare = /^=(?:([^=\s]*)=)?(.*)$/.exec(k);
    if (parseCompare) {
      const [, k, v] = parseCompare;
      return arrayItems.findIndex((el) => String(k && el ? getValue(el, k) : el) === String(v));
    }
  }

  const index = parseInt(k, 10);
  return Number.isNaN(index) ? items.length : index;
}

export function getOptions(parentValue, key) {
  const realParentValue = checkIsLocked(parentValue)
    ? parentValue.__value__
    : parentValue;
  return {
    key: key,
    realKey: getRealIndex(realParentValue, key),
    isArray: isArrayElement(key),
    length: Array.isArray(realParentValue) ? realParentValue.length : 0
  };
}

function mutate(pObj, pExt) {
  if (!checkIsObject(pObj)) {
    throw new Error('Type of variable should be Object or Array');
  }

  if (checkIsUndefined(pExt)) {
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
    newExt = pExt.map(function (el) { return deepPatch(el) });
  } else newExt = deepPatch(pExt);

  return mutate(pObj, newExt);
};

function toFunction(pObj) {
  var result = pObj;

  return function(pExt) {
    if (checkIsUndefined(pExt)) return result;
    result = mutate(result, pExt);
    return result;
  };
}

export default mutate;