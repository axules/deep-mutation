import mutate from 'deep-mutation';
import { OrderedMap } from 'immutable';
import isEqual from 'lodash.isequal';

const abc = 'abcdefghijkmnpqrstuvwxz-_0123456789';
const keyLen = [10, 15];
const deepLevel = 5;

document.getElementById('runButton').addEventListener('click', onClickRun);

function onClickRun() {
  runner(5);
}

function runner(runCount = 1) {
  let testData = null;
  let immutableResult = null;
  let mutateResult = null;
  let immutableMergeResult = null;
  const median = {
    immutable: [],
    immutableMerge: [],
    deepMutation: []
  };

  for (let i = 0; i < runCount; i++) {
    testData = generateData(generateDataLevel(3, ''), deepLevel, 3).filter(
      el => el[0].split('.').length > deepLevel
    );

    immutableResult = immutableTest(testData);
    immutableMergeResult = immutableMergeTest(immutableResult.result);
    mutateResult = mutateTest(testData);

    median.immutable.push(immutableResult.time);
    median.immutableMerge.push(immutableMergeResult.time);
    median.deepMutation.push(mutateResult.time);
  }

  const equals =
    isEqual(mutateResult.result, immutableResult.result) &&
    isEqual(mutateResult.result, immutableMergeResult.result);

  const medianImmutable =
    median.immutable.reduce((R, v) => R + v, 0) / runCount;
  const medianImmutableMerge =
    median.immutableMerge.reduce((R, v) => R + v, 0) / runCount;
  const medianDeepMutation =
    median.deepMutation.reduce((R, v) => R + v, 0) / runCount;

  document.getElementById('app').innerHTML = `
    <div>Calls count: ${runCount}</div>
    <hr/>
    <div><b>results are equal: ${equals}</b></div>
    <hr/>
    <div>Changes count: ${testData.length}</div>
    <hr/>
    <div>
      <b>deep-mutation: ${medianDeepMutation} ms</b>
      <br/> ${median.deepMutation.join(' ms <br />')}
    </div>
    <hr />
    <div>
      <b>immutable: ${medianImmutable} ms</b>
      <br/> ${median.immutable.join(' ms <br />')}
    </div>
    <hr />
    <div>
      <b>immutable-merge: ${medianImmutableMerge} ms</b>
      <br/> ${median.immutableMerge.join(' ms <br />')}
    </div>
    <hr />
    
  `;
}

function mutateTest(pChanges) {
  const begin = performance.now();
  const result = mutate({}, pChanges);
  const end = performance.now();
  return {
    time: end - begin,
    result
  };
}

function immutableMergeTest(pChanges) {
  const begin = performance.now();
  let iMap = OrderedMap({});
  const result = iMap.mergeDeep(pChanges).toJS();
  const end = performance.now();
  return {
    time: end - begin,
    result
  };
}

function immutableTest(pChanges) {
  const begin = performance.now();
  let iMap = OrderedMap({});
  for (let i = 0; i < pChanges.length; i++) {
    iMap = iMap.setIn(pChanges[i][0].split('.'), pChanges[i][1]);
  }
  // pChanges.forEach(el => (iMap = iMap.setIn(el[0].split("."), el[1])));
  const result = iMap.toJS();
  const end = performance.now();
  return {
    time: end - begin,
    result
  };
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genKey() {
  const len = rnd(...keyLen);
  const result = [];
  for (let i = 0; i < len; i++) {
    result.push(abc[rnd(0, abc.length - 1)]);
  }
  return result.join('');
}

function generateDataLevel(count, path = '') {
  const result = [];
  const prefix = path ? `${path}.` : '';

  function generateData(val) {
    if (val > 0.3 && val < 0.5) {
      return {
        value: Math.random() * 100000000,
        key: genKey()
      };
    }

    if (val >= 0.5) {
      return [1, 2, 3, 4, 5];
    }

    return Math.random() * 100000000;
  }

  for (let i = 0; i < count; i++) {
    result.push([`${prefix}${genKey()}`, generateData(Math.random())]);
  }
  return result;
}

function generateData(parents, deep, count) {
  let result = [].concat(parents);
  for (let i = 0; i < parents.length; i++) {
    const data = generateDataLevel(count, parents[i][0]);
    if (deep > 0) {
      result = result.concat(generateData(data, deep - 1, count));
    }
  }

  return result;
}
