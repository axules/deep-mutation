import mutate from '../index';


const data1 = [
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
];

const data2 = [
  // extend object
  [{ a: { aa: 10 } }, [['a.aa', 5]], { a: { aa: 5 } }],
  [{ a: { aa: 10 } }, [['a.bb 10', 5]], { a: { aa: 10, 'bb 10': 5 } }],
  [{ a: { aa: 10 } }, [['a.aa']], { a: { } }],
  [{ a: { aa: { aaa: 10 } } }, [['a.aa'], ['a.aa.aaa']], { a: { } }],
  [{ a: { aa: 10 } }, [['a.aa.[]', 1]], { a: { aa: [1] } }],
  [{ a: { aa: 10 } }, [['a.aa'], ['a']], { }],
  [{ a: { aa: 10 } }, ['a.aa', 'a'], { }],
  [{ a: 10 }, [['a.aa', 5]], { a: { aa: 5 } }],
  [{ a: 10 }, [['a.aa.aaa', 5]], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a.aa.aaa', 5], ['a.aa.aaa.aaaa', 2]], { a: { aa: { aaa: { aaaa: 2 } } } }],
  [{ a: 10 }, [['a.aa', 5], ['a.aa2', 2]], { a: { aa: 5, aa2: 2 } }],
  [{ a: 10 }, [['a.aa', 5], ['b.bb', 2]], { a: { aa: 5 }, b: { bb: 2 } }],
];

const arrayChanges = [
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
  [{ a: [1, 2, 3, 4, 5] }, [['a.[2]']], { a: [1, 2, 4, 5] }],
];

const objectChanges = [
  // changes are object
  [{ a: [] }, { 'a.[]': 5 }, { a: [5] }],
  [{ a: [] }, { 'a.[0]': 5 }, { a: [5] }],
  [{ a: [] }, { 'a.[2]': 5 }, { a: [undefined, undefined, 5] }],
  [{ a: [1] }, { 'a.[]': 5 }, { a: [1, 5] }],
  [{ a: [1] }, { 'a.[0]': 5 }, { a: [5] }],
  [{ a: { aa: 10 } }, { 'a.aa': 5 }, { a: { aa: 5 } }],
  [{ a: { aa: 10 } }, { 'a.aa': undefined, 'a.aaa': 99 }, { a: { aaa: 99 } }],
  [{ }, { 'a.aa.aaa': undefined }, { }],
  [{ }, [['a.aa.aaa']], { }],
  [{ a: { 0: 'v0', 1: 'v1' } }, [['a.0']], { a: { 1: 'v1' } }],
  [{ a: [1,2,3] }, [['a.[]']], { a: [1,2,3] }],
  [{ a: [1,2,3] }, [['a.[0]']], { a: [2,3] }],
  [{ a: [1,2,3] }, [['a.0']], { a: [undefined, 2,3] }],
];

const changeObject = [
  // set object, extend object
  [{ }, [['a', { aa: 5 }]], { a: { aa: 5 } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }], ['b.bb.bbb']], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5 } }], ['a.aa.aaa2', 1]], { a: { aa: { aaa: 5, aaa2: 1 } } }],
  [{ a: 10 }, [['a', { aa: { aaa: 5, aaa2: 1 } }], ['a.aa.aaa2']], { a: { aa: { aaa: 5 } } }],
  [{ a: 10 }, [['a', { aa: 5 }], ['a', [1,2,3]]], { a: [1,2,3] }],
  [{ a: 10 }, [['a', { aa: 5 }], ['a.aa', 12]], { a: { aa: 12 } }],
  [{ b: 20 }, [['a', { aa: 5 }], ['a']], { b: 20 }],
  [{ b: 20 }, [['a', { aa: 5 }], ['a.aa']], { a: { }, b: 20 }],
  [{ }, [['a.a1', 200], ['a', { a2: 100 }]], { a: { a2: 100 } }],
  [{ }, [['a', [1, 2, 3, 4, 5]], ['a.[2]']], { a: [1, 2, 4, 5] }],
];

const complexChanges = [
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

describe('mutate', () => {
  describe('Dataset - data1: ', () => {
    test.each(data1)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });

    test.each(data1)('mutate(%j)(%j)', (obj, changes, expected) => {
      expect(mutate(obj)(changes)).toEqual(expected);
    });
  });

  describe('Dataset - data2: ', () => {
    test.each(data2)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });

    test.each(data2)('mutate(%j)(%j)', (obj, changes, expected) => {
      expect(mutate(obj)(changes)).toEqual(expected);
    });
  });
  
  describe('Dataset - arrayChanges: ', () => {
    test.each(arrayChanges)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });

    test.each(arrayChanges)('mutate(%j)(%j)', (obj, changes, expected) => {
      expect(mutate(obj)(changes)).toEqual(expected);
    });
  });

  describe('Dataset - objectChanges: ', () => {
    test.each(objectChanges)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });

    test.each(objectChanges)('mutate(%j)(%j)', (obj, changes, expected) => {
      expect(mutate(obj)(changes)).toEqual(expected);
    });
  });

  describe('Dataset - changeObject: ', () => {
    test.each(changeObject)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });
  });

  describe('Dataset - complexChanges: ', () => {
    test.each(complexChanges)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });
  });
});
