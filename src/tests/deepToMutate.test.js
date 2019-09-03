import mutate, { deepPatch } from '../index';

const data = [
  [
    { a: { a1: { a11: 10 }, a2: 20 }, b: 99 },
    { a: deepPatch({ a2: 18, a3: 30, a4: { a41: 41 } }), 'a.a4.a41': 98 },
    { a: { a1: { a11: 10 }, a2: 18, a3: 30, a4: { a41: 98 } }, b: 99 }
  ],

  [
    { a: { a1: 1 } },
    { 'a.a4': { a41: 1, a42: 5 }, a: deepPatch({ a4: { a41: 41 } }) },
    { a: { a1: 1, a4: { a41: 41, a42: 5 } } }
  ],

  [
    { a: { a1: 1, a4: { a41: 1, a42: 5 } } },
    deepPatch({ a: { a4: { a41: 41 } } }),
    { a: { a1: 1, a4: { a41: 41, a42: 5 } } }
  ],

  [
    { a: { a1: 1 } },
    { a: deepPatch({ a4: { a41: 41, a45: 1 } }), 'a.a4': deepPatch({ a41: 12, a42: 10, a43: [1,2,3] }) },
    { a: { a1: 1, a4: { a41: 12, a45: 1, a42: 10, a43: [1,2,3] } } }
  ],

  [
    { a: { a1: 1, a4: { a41: 1, a42: 5 } } },
    [deepPatch({ a: { a4: { a41: 41 } } }), deepPatch({ a: { a4: { a42: 42 } } })],
    { a: { a1: 1, a4: { a41: 41, a42: 42 } } }
  ],
];

describe('mutate with deep', () => {
  test.each(data)('mutate(%j, %j) === %j', (obj, ext, expected) => {
    expect(mutate(obj, ext)).toEqual(expected);
  });
});