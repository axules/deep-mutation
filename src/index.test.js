import mutate from './index';

const simpleArraysData = [
  [{ a: 10 }, [['a', 5]], { a: 5 }],
  [{ a: 10 }, [['b', 5]], { a: 10, b: 5 }],
  [{}, [['a', 10], ['b', 5]], { a: 10, b: 5 }],
  [{ a: 10 }, [['a']], { }],
  [{ a: 10 }, [null], { a: 10 }],
  [{ a: 10 }, [['a'], ['b']], { }],
  [{ a: 10 }, ['a', 'b'], { }],
  [{ a: 10 }, [['a'], ['b', 5]], { b: 5 }],
  [{ a: 10 }, [['a', [1,2,3]]], { a: [1,2,3] }],
  [{ a: 10 }, [['a', { aa: 1 }]], { a: { aa: 1 } }],
  [{ a: 10 }, [['a', 5], ['b', { bb: 2 }]], { a: 5, b: { bb: 2 } }],
  // extend object
  [{ a: { aa: 10 } }, [['a.aa', 5]], { a: { aa: 5 } }],
  [{ a: { aa: 10 } }, [['a.aa']], { a: { } }],
  [{ a: { aa: 10 } }, [['a.aa.[]', 1]], { a: { aa: [1] } }],
  [{ a: { aa: 10 } }, [['a.aa'], ['a']], { }],
  [{ a: { aa: 10 } }, ['a.aa', 'a'], { }],
  [{ a: 10 }, [['a.aa', 5]], { a: { aa: 5 } }],
  [{ a: 10 }, [['a.aa.aaa', 5]], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a.aa.aaa', 5], ['a.aa.aaa.aaaa', 2]], { a: { aa: { aaa: { aaaa: 2 } } } }],
  [{ a: 10 }, [['a.aa', 5], ['a.aa2', 2]], { a: { aa: 5, aa2: 2 } }],
  [{ a: 10 }, [['a.aa', 5], ['b.bb', 2]], { a: { aa: 5 }, b: { bb: 2 } }],
  // extend array
  [[], [['[]', 5]], [5]],
  [{ a: [] }, [['a.[]', 5]], { a: [5] }],
  [{ a: [] }, [['a.[0]', 5]], { a: [5] }],
  [{ a: [] }, [['a[0]', 5]], { a: [5] }],
  [{ a: [] }, [['a[][]', 5]], { a: [[5]] }],
  [{ a: [] }, [['a.[].[]', 5]], { a: [[5]] }],
  [{ a: [] }, [['a.[2]', 5]], { a: [undefined, undefined, 5] }],
  [{ a: [1] }, [['a.[]', 5]], { a: [1, 5] }],
  [{ a: [1] }, [['a.[]', 5],['a.[]', 7]], { a: [1, 5, 7] }],
  [{ a: [1] }, [['a.[0]', 5]], { a: [5] }],
  [{ a: [1] }, [['a.[0]']], { a: [] }],
  // changes are object
  [{ a: [] }, { 'a.[]': 5 }, { a: [5] }],
  [{ a: [] }, { 'a.[0]': 5 }, { a: [5] }],
  [{ a: [] }, { 'a.[2]': 5 }, { a: [undefined, undefined, 5] }],
  [{ a: [1] }, { 'a.[]': 5 }, { a: [1, 5] }],
  [{ a: [1] }, { 'a.[0]': 5 }, { a: [5] }],
  [{ a: { aa: 10 } }, { 'a.aa': 5 }, { a: { aa: 5 } }],
  [{ a: { aa: 10 } }, { 'a.aa': undefined, 'a.aaa': 99 }, { a: { aaa: 99 } }],
  // set object, extend object
  [{ a: 10 }, [['a', { aa: 5 }]], { a: { aa: 5 } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }]], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }], ['a.aa.aaa2', 1]], { a: { aa: { aaa: 5, aaa2: 1 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5, aaa2: 1 } }], ['a.aa.aaa2']], { a: { aa: { aaa: 5 } } }],
];

describe('mutate: ', () => {
  test('should except by object', () => {
    const obj = 10;
    const changes = [];
    try {
      mutate(obj, changes);
    } catch (ex) {
      expect(ex.message).toBe('Type of variable shoud be Object or Array');
    }
  });

  test('should except by path', () => {
    const obj = { a: 100 };
    const changes = [ ['', 1000] ];
    try {
      mutate(obj, changes);
    } catch (ex) {
      expect(ex.message).toBe('Path should not be empty');
    }
  });

  test('should except by changes', () => {
    const obj = { a: 100 };
    const changes = 10;
    try {
      mutate(obj, changes);
    } catch (ex) {
      expect(ex.message).toBe('Changes should be Object or Array');
    }
  });

  test('should returns new object', () => {
    const obj = { a: 1 };
    const changes = [];
    const result = mutate(obj, changes);
    expect(result === obj).toBe(false);
  });

  test.each(simpleArraysData)('mutate(%j   +   %j)', (obj, changes, expected) => {
    const result = mutate(obj, changes);
    expect(result).toEqual(expected);
  });

  test('should deep update', () => {
    const obj = { a: { aa: { aaa: 10 }, aa2: { aa2a: 5 } }, b: { bb: { bbb: 1 } }, c: { cc: { ccc: 1 } } };
    const changes = [['a.aa.aaa', 15], ['c.cc2', 7]];
    const result = mutate(obj, changes);
    expect(result === obj).toBe(false);
    expect(result.a === obj.a).toBe(false);

    expect(result.a.aa === obj.a.aa).toBe(false);
    expect(result.a.aa.aaa === obj.a.aa.aaa).toBe(false);

    expect(result.a.aa2 === obj.a.aa2).toBe(true);
    expect(result.a.aa2.aa2a === obj.a.aa2.aa2a).toBe(true);

    expect(result.b === obj.b).toBe(true);
    expect(result.b.bb === obj.b.bb).toBe(true);
    expect(result.b.bb.bbb === obj.b.bb.bbb).toBe(true);

    expect(result.c === obj.c).toBe(false);
    expect(result.c.cc === obj.c.cc).toBe(true);
    expect(result.c.cc2 === obj.c.cc2).toBe(false);
    expect(result.c.cc.ccc === obj.c.cc.ccc).toBe(true);
  });
});
