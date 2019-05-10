import { splitPath } from '../index';

const data = [
  ['a.b.c', ['a', 'b', 'c']],
  ['a.', ['a', '']],
  ['a.[0]', ['a', '[0]']],
  ['', ['']],
];

const data2 = [
  [['a', 'b', 'c']],
  [[]],
  [[1,2,3]],
  [['a.02', 'b.01']],
];

describe('splitPath', () => {
  test.each(data)('splitPath(%s) = %j', (data, expected) => {
    expect(splitPath(data)).toEqual(expected);
  });

  test.each(data2)('splitPath(%s)', (data) => {
    expect(splitPath(data)).toBe(data);
  });

  test('should return exception for Object path', () => {
    try {
      splitPath({});
    } catch (ex) {
      expect(ex.message).toBe('Path should be String or Array of Strings');
    }
  });
});