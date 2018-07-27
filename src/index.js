function XMutateRemovedElementX() {}
function XMutateNewElementX(value) {
  this.__value__ = value;
}
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
function extToTree(pExt) {
  // +++++++++++++++++++++++++++
  function pairValue(pair, isMutated) {
    if (pair.length === 1) {
      return isMutated 
        ? undefined 
        : new XMutateRemovedElementX();
    }

    if (
      !isMutated 
      && pair[1] 
      && pair[1] instanceof Object 
      && !Array.isArray(pair[1])
    ) {
      return new XMutateNewElementX(pair[1]);
    }

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
    
    let isMutatedObj = false;
    pieces.reduce((R, cur, curI) => {
      if (cur === '[]') {
        cur = `[+${String(Math.random()).slice(2, 12)}]`;
      }

      const isMutateCur = R[cur] instanceof XMutateNewElementX;
      if (!isMutatedObj && isMutateCur) {
        isMutatedObj = true;
      }

      let newValue = isMutateCur ? R[cur].__value__ : R[cur];
      if (curI + 1 >= pieces.length) newValue = pairValue(PAIR, isMutatedObj);
      else {
        if (!newValue) newValue = {};
        else if (!(newValue instanceof Object)) {
          // console.warn(`Warning: In "${key}", bad path for "${cur}", it replaced on empty Object ({})`);
          newValue = {};
        }
      }

      if (isMutateCur) R[cur].__value__ = newValue;
      else R[cur] = newValue;

      return newValue;
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

  if (tree instanceof XMutateNewElementX) return tree.__value__;

  const ARR_REG = new RegExp('^\\[([^\\[\\].]*)\\]$');
  const pieces = Object.keys(tree).map(k => k.trim());
  const needArray = pieces.some(p => !!ARR_REG.exec(p));
  const result = mutateObj(point, needArray ? mutateTypes.array : mutateTypes.object);

  pieces.forEach(key => {
    const isArray = ARR_REG.exec(key);
    let k = key;
    if (isArray) {
      k = isArray[1].trim();
      if (k === '' || k.slice(0,1) === '+') k = result.length;
    }
    if (tree[key] instanceof XMutateRemovedElementX) {
      if (isArray) result.splice(k, 1);
      else delete result[k];
    } else {
      result[k] = updateSection(result[k], tree[key]);
    }
  });
  return result;
}
/* ############################################################################# */
export default function mutate(pObj, pExt) {
  if (typeof (pObj) !== 'object') {
    throw new Error('Type of variable shoud be Object or Array');
  }
  const tree = extToTree(pExt);
  const newObj = updateSection(pObj, tree);
  return newObj;
}
/* ############################################################################# */

