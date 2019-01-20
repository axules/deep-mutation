import { getValue } from '../index';


const data = [
  [null, 'a', undefined],
  [[10], '0', 10],
  [[{ a: 10 }], '0.a', 10],
  [[{ a: 10 }], '1.a', undefined],
  [{ a: 10 }, 'a', 10],
  [{ a: 10 }, 'a.aa', undefined],
  [{ a: 10 }, 'a2', undefined],
  [{ }, 'a', undefined],
  [{ }, 'a.aa', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a', { aa: { aaa: 10 } }],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa', { aaa: 10 }],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa', 10],
  [{ a: { aa: { aaa: 10 } } }, '[a]', { aa: { aaa: 10 } }],
  [{ a: { aa: { aaa: 10 } } }, 'a.[aa]', { aaa: 10 }],
  [{ a: { aa: { aaa: 10 } } }, '[a].[aa].[aaa]', 10],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa2', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a2', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa.aaaa', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2.aaa', undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a2.aa.aaa', undefined],

  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[0]', 1],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[2]', 3],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[3]', undefined],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[]', undefined],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[+5454]', undefined],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[].bbb', undefined],
];

const data2 = [
  [{ a: { aa: { aaa: 10 } } }, 'a'.split('.'), { aa: { aaa: 10 } }],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa'.split('.'), { aaa: 10 }],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa'.split('.'), 10],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa2'.split('.'), undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2'.split('.'), undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a2'.split('.'), undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa.aaaa'.split('.'), undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2.aaa'.split('.'), undefined],
  [{ a: { aa: { aaa: 10 } } }, 'a2.aa.aaa'.split('.'), undefined],

  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.0'.split('.'), 1],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.2'.split('.'), 3],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.3'.split('.'), undefined],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.'.split('.'), undefined],
];

describe('getValue', () => {
  test.each(data)('getValue(%j, %s) === %j', (obj, path, expected) => {
    const result = getValue(obj, path);
    expect(result).toEqual(expected);
  });

  test.each(data2)('getValue(%j, %j) === %j', (obj, path, expected) => {
    const result = getValue(obj, path);
    expect(result).toEqual(expected);
  });
});