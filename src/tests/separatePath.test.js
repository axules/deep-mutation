import { separatePath } from '../index';

const separatePathData = [
  ['a[]', 'a.[]'],
  ['a.[]', 'a.[]'],
  ['a.b.c[].d[]', 'a.b.c.[].d.[]'],
];

describe('separatePath', () => {
  test.each(separatePathData)('separatePath(%s) === %s', (data, expected) => {
    expect(separatePath(data)).toBe(expected);
  });
});