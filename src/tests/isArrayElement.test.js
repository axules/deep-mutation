import { isArrayElement } from '../index';

const data = [
  ['[]', true],
  ['[+12312]', true],
  ['[99]', true],
  ['key', false],
  [99, false],
  [null, false],
  [undefined, false],
  [false, false],
  [new Date(), false],
  [{}, false],
];

describe('isArrayElement', () => {
  test.each(data)('isArrayElement(%s) === %b', (value, expected) => {
    const result = isArrayElement(value);
    expect(result).toEqual(expected);
  });
});