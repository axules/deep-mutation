import mutate, { deepPatch } from '../index';

const data = [
  [
    'Obj',
    { a: { a1: { a11: 10 }, a2: 20 }, b: 99 },
    { a: { a2: 18, a3: 30, a4: { a41: 41 } }, b: 100 },
    { a: { a1: { a11: 10 }, a2: 18, a3: 30, a4: { a41: 41 } }, b: 100 }
  ],

  [
    'Obj-deep',
    { a: { a1: { a11: 10, a12: { a121: 17 } }, a2: 20 }, b: 99 },
    { a: { a1: deepPatch({ a12: { a122: 99 } }) } },
    { a: { a1: { a11: 10, a12: { a121: 17, a122: 99 } }, a2: 20 }, b: 99 }
  ],

  [
    'deep',
    { a: { a1: 1, a4: { a41: 1, a42: 5 } } },
    deepPatch({ a: { a4: { a41: 41 } } }),
    { a: { a1: 1, a4: { a41: 41, a42: 5 } } }
  ],

  [
    'arrayOf-Obj',
    { a: { a1: 1 } },
    [{ a4: { a41: 41, a45: 1 } }, { a4: { a41: 12, a42: 10, a43: [1,2,3] } }],
    { a: { a1: 1 }, a4: { a41: 12, a45: 1, a42: 10, a43: [1,2,3] } }
  ],

  [
    'arrayOf-deep',
    { a: { a1: 1, a4: { a41: 1, a42: 5 } } },
    [deepPatch({ a: { a4: { a41: 41 } } }), deepPatch({ a: { a4: { a42: 42 } } })],
    { a: { a1: 1, a4: { a41: 41, a42: 42 } } }
  ],
];

describe('mutate with deep', () => {
  test.each(data)('mutate.deep(*, %s)', (title, obj, ext, expected) => {
    expect(mutate.deep(obj, ext)).toEqual(expected);
  });
});