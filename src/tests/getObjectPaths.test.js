import { getObjectPaths } from '../index';

const errorValue = new Error('Example');
const recursivePath = {
  a: 10,
  b: {
    b1: 99,
    b2: null,
  }
};
recursivePath.b.b2 = recursivePath;

const data = [
  [
    { a: { a1: { a11: 10 }, a2: 20 }, b: 99 },
    undefined,
    [['a.a1.a11', 10], ['a.a2', 20], ['b', 99]]
  ],
  [null, undefined, []],
  [undefined, undefined, []],
  ['11111', undefined, []],
  [10, undefined, []],
  [10.8, undefined, []],
  [new Error(), undefined, []],
  [{}, undefined, []],
  [[], undefined, []],
  [
    { a: { a1: errorValue } },
    undefined,
    [['a.a1', errorValue]]
  ],
  [
    { a: { a1: { 'a1.1': 10 }, a2: 20 }, 'b.bb': 99 },
    undefined,
    [[['a', 'a1', 'a1.1'], 10], ['a.a2', 20], [['b.bb'], 99]]
  ],
  [recursivePath, undefined, [['a', 10], ['b.b1', 99]]],
  [
    { a: { a1: { a11: 10 }, a2: 20 }, b: 99 },
    ['x'],
    [['x.a.a1.a11', 10], ['x.a.a2', 20], ['x.b', 99]]
  ],
];

describe('getObjectPaths', () => {
  test.each(data)('getObjectPaths(%j, %j) === %j', (data, prefix, expected) => {
    expect(getObjectPaths(data, prefix)).toEqual(expected);
  });
});