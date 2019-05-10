import { isArrayElement } from '../index';

const data = [
  ['[]', true],
  ['[+12312]', true],
  ['[99]', true],
  ['key', false],
];

describe('isArrayElement', () => {
  test.each(data)('isArrayElement(%s) === %b', (value, expected) => {
    const result = isArrayElement(value);
    expect(result).toEqual(expected);
  });
});