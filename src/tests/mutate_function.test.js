import mutate from '../index';


describe('mutate patch-function', () => {
  test('should return function', () => {
    const obj = [1, 2, 3];
    const patch = mutate(obj);

    expect(typeof patch).toEqual('function');
    expect(patch.length).toEqual(1);
  });

  test('should return new patched array each time', () => {
    const obj = [1, 2, 3];
    const patch = mutate(obj);
    const result1 = patch({ '[]': 10 });
    const result2 = patch({ '[]': 20 });
    const result3 = patch();

    expect(obj).toEqual([1, 2, 3]);
    expect(result1).toEqual([1, 2, 3, 10]);
    expect(result2).toEqual([1, 2, 3, 10, 20]);
    expect(result3).toBe(result2);
  });

  test('should return new patched object each time', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const patch = mutate(obj);
    const result1 = patch({ d: 4 });
    const result2 = patch({ e: 5 });
    const result3 = patch();

    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    expect(result1).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    expect(result2).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
    expect(result3).toBe(result2);
  });
});