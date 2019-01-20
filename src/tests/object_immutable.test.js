import mutate from '../index';


describe('mutate', () => {
  describe( 'should return the same object', () => {
    test('when changes are empty array', () => {
      const obj = { a: 1 };
      const changes = [];
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });
  
    test('when changes are empty object', () => {
      const obj = { a: 1 };
      const changes = {};
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });
  
    test('when new walue is equal of current value', () => {
      const obj = { a: 1 };
      const changes = { a: 1 };
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });

    test('when changes cantains instruction to remove undefined elements', () => {
      const obj = { a: 1 };
      const changes = { b: undefined };
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });

    test('when new walue is equal of current value', () => {
      const obj = { a: 1 };
      const changes = { a: 1, b: undefined };
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });
  
    test('when new walue is equal of current value in deep path', () => {
      const obj = { a: { aa: [1,2,3] } };
      const changes = { 'a.aa.[2]': 3 };
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });
  
    test('when new walue is equal of current value in deep path', () => {
      const obj = { a: { aa: { aaa: 35 } } };
      const changes = { 'a.aa.aaa': 35 };
      const result = mutate(obj, changes);
      expect(result).toBe(obj);
    });
  });

  describe( 'should return new object', () => {
    test('when changes contains new value as array', () => {
      const obj = { a: 1 };
      const changes = [['a', 15]];
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: 15 });
    });
  
    test('when changes contains new value as object', () => {
      const obj = { a: 1 };
      const changes = { a: 30 };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: 30 });
    });

    test('when changes contains new value', () => {
      const obj = { a: 1 };
      const changes = { a: 1, b: 7 };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: 1, b: 7 });
    });

    test('when changes contains instruction to remove defined prop', () => {
      const obj = { a: 1 };
      const changes = { a: undefined };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ });
    });

    test('when changes contains instruction to remove defined prop', () => {
      const obj = { a: { aa: { aaa: 35 } } };
      const changes = { 'a.aa.aaa': undefined };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: { aa: { } } });
    });
  
    test('when new walue is not equal of current value in deep path', () => {
      const obj = { a: { aa: [1,2,3] } };
      const changes = { 'a.aa.[2]': 7 };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: { aa: [1,2,7] } });
    });
  
    test('when new walue is not equal of current value in deep path', () => {
      const obj = { a: { aa: { aaa: 35 } } };
      const changes = { 'a.aa.aaa': 99 };
      const result = mutate(obj, changes);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: { aa: { aaa: 99 } } });
    });
  });
});
