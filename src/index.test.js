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
  [{ }, [['a', { aa: 5 }]], { a: { aa: 5 } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }]], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }], ['a.aa.aaa2', 1]], { a: { aa: { aaa: 5, aaa2: 1 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5, aaa2: 1 } }], ['a.aa.aaa2']], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a', { aa: 5 }], ['a', [1,2,3]]], { a: [1,2,3] }],
  [{ a: 10 }, [['a', { aa: 5 }], ['a.aa', 12]], { a: { aa: 12 } }],
  [{ b: 20 }, [['a', { aa: 5 }], ['a']], { b: 20 }],
  [{ b: 20 }, [['a', { aa: 5 }], ['a.aa']], { a: { }, b: 20 }],
  [{ }, [['a.a1', 200], ['a', { a2: 100 }]], { a: { a2: 100 } }],
  // complex changes
  [{ a: 10, b: [], c: {} }, { a: 50, b: { b1: 10 }, c: [1,2,3] }, { a: 50, b: { b1: 10 }, c: [1,2,3] }],
  [
    { a: 10, b: [], c: {}, d: { d1: 12 }, e: [9,8,7] }, 
    { a: 50, b: { b1: 10 }, c: [1,2,3], 'c.[]': { cc: 22 }, 'b.b2': 17, 'd.d2': 15, 'e.[0]': 1, 'e.[]': 3 },
    { a: 50, b: { b1: 10, b2: 17 }, c: [1,2,3, { cc: 22 }], d: { d1: 12, d2: 15 }, e: [1,8,7,3] }
  ],
  [
    { a: { a1: { a1_1: 22 } }, b: [{ b1: 10 }], c: [{ c1: 1 }] }, 
    { 'a.a1.a1_1': 33, 'a.a1.a1_2': 9, 'a.a2': 14, 'b.[0].b1': 11, 'b.[]': 15, 'b.[0].b2': null, 'c[0].c1': undefined, 'c[0]': 7 },
    { a: { a1: { a1_1: 33, a1_2: 9 }, a2: 14 }, b: [{ b1: 11, b2: null }, 15], c: [7] }
  ],
  [
    { a: 10, b: 20 }, 
    { a: { a1: 1, a2: 2 }, 'a.a3.a3_1': 20, b: [1,2,3,{ b1: 1 }], 'b.[]': 11, 'b[3].b2.b2_1.b2_1_1': 'b2_1_1 value', 'c.[]': 14 },
    { a: { a1: 1, a2: 2, a3: { a3_1: 20 } }, b: [1,2,3,{ b1: 1, b2: { b2_1: { b2_1_1: 'b2_1_1 value' } } }, 11], c: [14] }
  ]
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
    expect(result).not.toBe(obj);
  });

  test.each(simpleArraysData)('mutate(%j   +   %j)', (obj, changes, expected) => {
    const result = mutate(obj, changes);
    expect(result).toEqual(expected);
  });

  test('should deep update', () => {
    const obj = { a: { aa: { aaa: 10 }, aa2: { aa2a: 5 } }, b: { bb: { bbb: 1 } }, c: { cc: { ccc: 1 } } };
    const changes = [['a.aa.aaa', 15], ['c.cc2', 7]];
    const result = mutate(obj, changes);
    expect(result).not.toBe(obj);
    expect(result.a).not.toBe(obj.a);

    expect(result.a.aa).not.toBe(obj.a.aa);
    expect(result.a.aa.aaa).not.toBe(obj.a.aa.aaa);

    expect(result.a.aa2).toBe(obj.a.aa2);
    expect(result.a.aa2.aa2a).toBe(obj.a.aa2.aa2a);

    expect(result.b).toBe(obj.b);
    expect(result.b.bb).toBe(obj.b.bb);
    expect(result.b.bb.bbb).toBe(obj.b.bb.bbb);

    expect(result.c).not.toBe(obj.c);
    expect(result.c.cc).toBe(obj.c.cc);
    expect(result.c.cc2).not.toBe(obj.c.cc2);
    expect(result.c.cc.ccc).toBe(obj.c.cc.ccc);
  });

  test('should set object value', () => {
    function MyParentClass() {}
    MyParentClass.prototype.myFunc = () => 10;
    function MyClass() {}
    MyClass.prototype = Object.create(MyParentClass.prototype);

    const obj = { };
    const itArray = [1,2,3];
    const itMyObject = new MyClass();

    const itObject = { b1: 1, b2: 2 };
    const changes = [
      ['a.a1', itArray],
      ['a.a2', itMyObject],
      ['b', itObject]
    ];
    const result = mutate(obj, changes);

    expect(result.a.a1).toBe(itArray);
    expect(result.a.a2).toBe(itMyObject);
    expect(result.a.a2.myFunc).not.toBe(undefined);
    expect(result.a.a2.myFunc()).toBe(10);
    expect(result.b).toBe(itObject);
  });

  test('should replace by object value', () => {
    const obj = { b: { b5: 5, b6: 6 } };
    const changes = {
      b: { b1: 1, b2: 2, b3: 3 }
    };
    const result = mutate(obj, changes);

    expect(result.b).toEqual(changes.b);
    expect(result.b).toBe(changes.b);
  });

  test('should replace by array value', () => {
    const obj = { b: [5,6] };
    const changes = {
      b: [1,2,3]
    };
    const result = mutate(obj, changes);

    expect(result.b).toEqual(changes.b);
    expect(result.b).toBe(changes.b);
  });

  test('should change object value', () => {
    const obj = { b: [] };
    const patchObject = { b1: 1, b2: 2, b3: 3 };
    const changes = [
      ['b', patchObject],
      ['b.b4', 4]
    ];
    const result = mutate(obj, changes);

    expect(result.b).toEqual(patchObject);
    expect(result.b).toBe(patchObject);
    expect(patchObject).toEqual({ b1: 1, b2: 2, b3: 3, b4: 4 });
  });

  test('should change array value', () => {
    const obj = { b: [5,6] };
    const patchArray = [1,2,3];
    const changes = [
      ['b', patchArray],
      ['b.[]', 4]
    ];
    const result = mutate(obj, changes);

    expect(result.b).toEqual(patchArray);
    expect(result.b).toBe(patchArray);
    expect(patchArray).toEqual([1,2,3,4]);
  });
  
  test('should returns equal results for Array and Object changes', () => {
    const obj = {
      a: 100,
      b: 200,
      c: {
        c1: 1,
        c2: 2
      },
      d: []
    };
      
    const arrayChanges = [
      ['a', 111],
      ['b.b1', 222],
      ['b.b2', 'text'],
      ['c.c1', 20],
      ['c.c2'],
      ['d.[]', 10],
      ['d.[]', 20],
      ['e', [1,2,3]]
    ];

    const objectChanges = {
      'a': 111,
      'b.b1': 222,
      'b.b2': 'text',
      'c.c1': 20,
      'c.c2': undefined,
      'd.[+123434]': 10,
      'd.[+554542]': 20,
      'e': [1,2,3]
    };
      
    const result1 = mutate(obj, arrayChanges);
    const result2 = mutate(obj, objectChanges);

    expect(result1).toEqual(result2);
  });
});
