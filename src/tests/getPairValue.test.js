import { getPairValue } from '../index';

const data = [
  [['a.b.c', 25], 25],
  [['a.b.c', 999, 12], 999],
  [['a.b.c'], undefined],
  [[], undefined],
  ['', undefined],
  [{}, undefined],
  [12, undefined],
  [null, undefined],
];

describe.skip('getPairValue', () => {
  test.each(data)('getPairValue(%j) === %j', (data, expected) => {
    expect(getPairValue(data)).toBe(expected);
  });
});