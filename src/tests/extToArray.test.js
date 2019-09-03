import { extToArray, deepPatch } from '../index';

const data = [
  [[['a.b.c', 25]], [['a.b.c', 25]]],
  [[['a.b.c']], [['a.b.c']]],
  [null, []],
  [undefined, []],
  [1, []],
  ['1123', []],
  [11.5, []],
  [new Error(), []],
  [{}, []],
  [[], []],

  [{ 'a.a1': 100, 10: 1000 }, [['10', 1000], ['a.a1', 100]]],
  [{ 'a.a1': { z: 10, j: 50 } }, [['a.a1', { z: 10, j: 50 }]]],
  [{ 'a.a1': undefined }, [['a.a1']]],
  [{ 'a.a1': null }, [['a.a1', null]]],

  [{ 'a.a1': deepPatch({ z: 10, z2: { z21: 100 } }) }, [['a.a1.z', 10], ['a.a1.z2.z21', 100]]],
  [[['a.a1', deepPatch({ z: 10, z2: { z21: 100 } })]], [['a.a1.z', 10], ['a.a1.z2.z21', 100]]],
  [[[['a', 'a1'], deepPatch({ z: 10, z2: { z21: 100 } })]], [['a.a1.z', 10], ['a.a1.z2.z21', 100]]],

  [{ '': deepPatch({ z: 10, z2: { z21: 100 } }) }, [['z', 10], ['z2.z21', 100]]],
  [[['', deepPatch({ z: 10, z2: { z21: 100 } })]], [['z', 10], ['z2.z21', 100]]],
  [[[null, deepPatch({ z: 10, z2: { z21: 100 } })]], [['z', 10], ['z2.z21', 100]]],
  [[[[], deepPatch({ z: 10, z2: { z21: 100 } })]], [['z', 10], ['z2.z21', 100]]],
  [[deepPatch({ z: 10, z2: { z21: 100 } })], [['z', 10], ['z2.z21', 100]]],
  [deepPatch({ z: 10, z2: { z21: 100 } }), [['z', 10], ['z2.z21', 100]]],

  [{ 'a.a1': deepPatch({ z: 10, z2: { z21: 100 } }), 'a.a1.z': 9999 }, [['a.a1.z', 10], ['a.a1.z2.z21', 100], ['a.a1.z', 9999]]],
];

describe('extToArray', () => {
  test.each(data)('extToArray(%j) === %j', (data, expected) => {
    expect(extToArray(data)).toEqual(expected);
  });

  test('should return the same array', () => {
    const data = [['a', 10], ['b'], ['c.11', 20]];
    expect(extToArray(data)).toBe(data);
  });

  test('should return array with the same Object', () => {
    const value = { z: 1, z2: 2 };
    const data = { 'a.a2': value };
    expect(extToArray(data)[0][1]).toBe(value);
  });
});