import { extToTree, XMutateLockedElementX } from '../index';

const testCases = [
  [
    { 'a.a2': [123] }, 
    undefined, 
    { a: { a2: new XMutateLockedElementX([123]) } }
  ],
  [
    { 'a.a2': [123] },
    { a: { a2: [] } },
    { a: { a2: new XMutateLockedElementX([123]) } }
  ],
  [
    { 'a.a2[]': 123, 'a.a2.[]': 321 },
    undefined,
    { a: { a2: { '[+101]': 123, '[+102]': 321 } } }
  ],
  [
    { 'a.a2[>2]': 123 },
    undefined,
    { a: { a2: { '[>2]': 123 } } }
  ],
  // [
  //   { 'a.a2[>2...]': 123 },
  //   undefined,
  //   { a: { a2: { '[>2...]': 123 } } }
  // ],
  [
    { 'a.a2': { k: 1 }, 'a.a2.z': 5 }, 
    undefined, 
    { a: { a2: new XMutateLockedElementX({ k: 1, z: 5 }) } }
  ],
  [
    { 'a.a2.k': 1, 'a.a2.z': 5 },
    undefined,
    { a: { a2: { k: 1, z: 5 } } }
  ],
  [
    { 'a.a2.k': 1, 'a.a2.z': 5 },
    { a: { a2: { k: 1, z: 5 } } },
    {},
  ],
  [
    { 'a.a2.k': 1, 'a.a2.z': 5 },
    { a: { a2: { k: 1 } } },
    { a: { a2: { z: 5 } } },
  ],
];

describe('extToTree', () => {
  test.each(testCases)('%# extToArray(%j)', (data, obj, expected) => {
    const result = extToTree(data, obj);
    expect(result).toEqual(expected);
  });
});