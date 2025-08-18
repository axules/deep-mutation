import { separatePath } from '../index';

const data = [
  ['a[]', 'a.[]'],
  ['a.[]', 'a.[]'],
  ['a.b.c[].d[]', 'a.b.c.[].d.[]'],
];

describe('separatePath', () => {
  test.each(data)('separatePath(%s) === %s', (data, expected) => {
    expect(separatePath(data)).toBe(expected);
  });
});