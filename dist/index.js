"use strict";

exports.__esModule = true;
exports.getObjectPaths = getObjectPaths;
exports.extToArray = extToArray;
exports.separatePath = separatePath;
exports.splitPath = splitPath;
exports.checkIsExists = checkIsExists;
exports.getValue = getValue;
exports.isArrayElement = isArrayElement;
exports.getPairValue = getPairValue;
exports.getOptions = getOptions;
exports.deepPatch = deepPatch;
exports.default = void 0;

function XMutateRemovedElementX() {}

function XMutateLockedElementX(value) {
  this.__value__ = value;
}

function XDeepPatchX(value) {
  this.__value__ = value;
}

function XIssetMarkerX() {}

var ARRAY_REGEXP = new RegExp('^\\[([^\\[\\].]*)\\]$');
var MUTATE_TYPES = {
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

function getObjectPaths(obj, prefix, map) {
  if (prefix === void 0) {
    prefix = [];
  }

  if (map === void 0) {
    map = null;
  }

  if (!checkIsNativeObject(obj)) return [];
  var keys = Object.keys(obj);
  var isRoot = !map;
  var myMap = isRoot // eslint-disable-next-line no-undef
  ? new Map() : map; // ignore objects that were listened. It means that recursive links will be ignored

  if (myMap.has(obj)) return null;
  myMap.set(obj, new XIssetMarkerX());

  for (var i = 0; i < keys.length; i++) {
    var value = obj[keys[i]];
    var currentPath = prefix.concat([keys[i]]);

    if (checkIsNativeObject(value)) {
      getObjectPaths(value, currentPath, myMap);
    } else if (checkIsDeepPatch(value)) {
      getObjectPaths(value.__value__, currentPath, myMap);
    } else {
      var containsDot = currentPath.some(function (el) {
        return el.indexOf('.') >= 0;
      });
      myMap.set(containsDot ? currentPath : currentPath.join('.'), value);
    }
  }

  if (isRoot) {
    var result = [];
    myMap.forEach(function (val, key) {
      if (val instanceof XIssetMarkerX) return false;
      result.push([key, val]);
    });
    return result;
  }

  return null;
}

function extToArray(pExt) {
  var result = pExt;

  if (!Array.isArray(pExt)) {
    if (checkIsDeepPatch(pExt)) result = [pExt];else {
      if (!checkIsNativeObject(pExt)) return [];
      var keys = Object.keys(pExt || {});
      result = keys.map(function (key) {
        return checkIsUndefined(pExt[key]) ? [key] : [key, pExt[key]];
      });
    }
  }

  return result.reduce(function (R, pair) {
    var isDeep = checkIsDeepPatch(pair);
    if (!isDeep && (!pair || pair.length < 2)) return R;
    var pairVal = isDeep ? pair : getPairValue(pair);

    if (isDeep || checkIsDeepPatch(pairVal)) {
      var pairPath = isDeep || !pair[0] ? undefined : splitPath(pair[0]);
      var n = R.findIndex(function (el) {
        return el === pair;
      });
      if (n < 0) return R;
      return R.slice(0, n).concat(getObjectPaths(pairVal.__value__, pairPath), R.slice(n + 1));
    }

    return R;
  }, result);
}

function separatePath(path) {
  return typeof path == 'string' ? path.replace(new RegExp('([^\\.])(\\[)', 'g'), function (match, p1, p2) {
    return p1 + '.' + p2;
  }) : path;
}

function splitPath(path) {
  if (typeof path == 'string') return path.split('.');
  if (Array.isArray(path)) return path;
  throw new Error('Path should be String or Array of Strings');
}

function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function setValue(parent, key, value) {
  var isRemove = checkIsRemoved(value);
  var isUndefinedKey = checkIsUndefined(key);

  if (isRemove && (isUndefinedKey || !hasProperty(parent, key))) {
    return parent;
  }

  var isLocked = checkIsLocked(parent);

  if (isUndefinedKey) {
    if (isLocked) parent.__value__ = value;else return value;
  } else {
    var realParent = isLocked ? parent.__value__ : parent;

    if (isRemove) {
      if (Array.isArray(realParent)) realParent.splice(key, 1);else delete realParent[key];
    } else realParent[key] = value;
  }

  return parent;
}

function checkIsUndefined(value) {
  return typeof value === 'undefined';
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
  return value && typeof value === 'object';
}

function checkIsNativeObject(value) {
  return checkIsObject(value) && value.__proto__.constructor.name === 'Object';
} // It has been exported for tests, but you could use it if needed


function checkIsExists(pObject, pPath) {
  return !checkIsUndefined(getValue(pObject, pPath));
}

function getValue(pObject, pPath) {
  if (!checkIsObject(pObject)) return undefined;
  var pieces = splitPath(pPath);
  if (pieces.length === 0) return pObject;

  function preparePiece(piece) {
    return piece.replace(/(\[|\])+/g, '');
  }

  var lastIndex = pieces.length - 1;
  var node = pObject;

  for (var i = 0; i < lastIndex; i++) {
    var piece = preparePiece(pieces[i]);
    node = checkIsLocked(node[piece]) ? node[piece].__value__ : node[piece];

    if (!node || !checkIsObject(node) || checkIsRemoved(node)) {
      return undefined;
    }
  }

  return node[preparePiece(pieces[lastIndex])];
}

function isArrayElement(value) {
  return ARRAY_REGEXP.test(value);
}

function getPairValue(pair) {
  if (!Array.isArray(pair) || pair.length === 0) return undefined;
  var valueIndex = pair.length - 1 || 1;
  return pair[valueIndex];
}

function extToTree(pExt, pSource) {
  // +++++++++++++++++++++++++++
  function getNewValue(pair, isMutated) {
    if (!pair || pair.length === 0) return undefined;

    if (pair.length === 1) {
      return new XMutateRemovedElementX();
    }

    var pairValue = getPairValue(pair);

    if (!isMutated && checkIsObject(pairValue)) {
      return new XMutateLockedElementX(pairValue);
    }

    if (checkIsUndefined(pairValue)) {
      return new XMutateRemovedElementX();
    }

    return pairValue;
  } // +++++++++++++++++++++++++++


  if (!checkIsObject(pExt)) throw new Error('Changes should be Object or Array');
  var values = extToArray(pExt);
  return values.reduce(function (FULL_RESULT, PAIR) {
    if (!PAIR) return FULL_RESULT;
    if (typeof PAIR === 'string') PAIR = [PAIR];

    if (!PAIR[0] && PAIR[0] !== 0) {
      throw new Error('Path should not be empty');
    }

    var pathPieces = splitPath(separatePath(PAIR[0]));

    if (PAIR.length < 2 || checkIsUndefined(getPairValue(PAIR))) {
      if (!(checkIsExists(pSource, pathPieces) || checkIsExists(FULL_RESULT, pathPieces))) {
        return FULL_RESULT;
      }
    } else {
      var currentValue = getValue(pSource, pathPieces);
      if (currentValue === getPairValue(PAIR)) return FULL_RESULT;
    }

    var isLockedPath = false;
    pathPieces.reduce(function (parent, currentKey, currentI) {
      var isLastPiece = currentI >= pathPieces.length - 1;
      var actualKey = currentKey === '[]' ? '[+' + String(Math.random()).slice(2, 12) + ']' : currentKey;
      var newKey = isLockedPath ? getOptions(actualKey, parent).realKey : actualKey;
      var isLockedCurrent = !isLockedPath && hasProperty(parent, newKey) && checkIsLocked(parent[newKey]);
      isLockedPath = isLockedPath || isLockedCurrent;

      if (isLastPiece) {
        var newValue = getNewValue(PAIR, isLockedPath);
        if (isLockedPath) setValue(parent, newKey, newValue);else parent[newKey] = newValue;
        return FULL_RESULT;
      }

      var currentValue = isLockedCurrent ? parent[newKey].__value__ : parent[newKey];

      if (!checkIsObject(currentValue)) {
        // if (!!currentValue) {
        //   console.warn(`Warning: In "${PAIR[0]}", bad value for "${currentKey}", it will be replaced by empty Object ({})`);
        // }
        var _newValue = {};
        if (isLockedPath) setValue(parent, newKey, _newValue);else parent[newKey] = _newValue;
        return _newValue;
      }

      return currentValue;
    }, FULL_RESULT);
    return FULL_RESULT;
  }, {});
}

function updateSection(point, tree) {
  if (!tree || Array.isArray(tree) || !checkIsObject(tree)) return tree;
  if (checkIsLocked(tree)) return tree.__value__;
  var pieces = Object.keys(tree);
  var needArray = pieces.some(isArrayElement);
  var result = mutateObj(point, needArray ? MUTATE_TYPES.ARRAY : MUTATE_TYPES.OBJECT);
  pieces.forEach(function (key) {
    var opt = getOptions(key, result);
    var k = opt.realKey;

    if (checkIsRemoved(tree[key])) {
      if (opt.isArray) result.splice(k, 1);else delete result[k]; // setValue(result, k, tree[key]);
    } else {
      result[k] = updateSection(result[k], tree[key]);
    }
  });
  return result;
}

function getOptions(key, parentValue) {
  var realParentValue = checkIsLocked(parentValue) ? parentValue.__value__ : parentValue;
  var parse = ARRAY_REGEXP.exec(key);
  var result = {
    key: key,
    realKey: key,
    isArray: !!parse,
    length: Array.isArray(realParentValue) ? realParentValue.length : 0
  };

  if (parse) {
    var k = parse[1].trim();
    result.key = k;

    if (k === '' || k.slice(0, 1) === '+') {
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

  if (checkIsUndefined(pExt)) {
    return toFunction(pObj);
  }

  var tree = extToTree(pExt, pObj);

  if (Object.getOwnPropertyNames(tree).length === 0) {
    return pObj;
  }

  return updateSection(pObj, tree);
}

function deepPatch(pExt) {
  if (checkIsDeepPatch(pExt)) return pExt;
  return new XDeepPatchX(pExt);
}

mutate.deep = function (pObj, pExt) {
  var newExt = null;

  if (Array.isArray(pExt)) {
    newExt = pExt.map(function (el) {
      return deepPatch(el);
    });
  } else newExt = deepPatch(pExt);

  return mutate(pObj, newExt);
};

function toFunction(pObj) {
  var result = pObj;
  return function (pExt) {
    if (checkIsUndefined(pExt)) return result;
    result = mutate(result, pExt);
    return result;
  };
}

var _default = mutate;
exports.default = _default;