import { checkIsExists } from '../index';


const checkIsExistsData = [
  [null, 'a', false],
  [[10], '0', true],
  [[{ a: 10 }], '0.a', true],
  [[{ a: 10 }], '1.a', false],
  [{ a: 10 }, 'a', true],
  [{ a: 10 }, 'a.aa', false],
  [{ a: 10 }, 'a2', false],
  [{ }, 'a', false],
  [{ }, 'a.aa', false],
  [{ a: { aa: { aaa: 10 } } }, 'a', true],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa', true],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa', true],
  [{ a: { aa: { aaa: 10 } } }, '[a]', false],
  [{ a: { aa: { aaa: 10 } } }, 'a.[aa]', false],
  [{ a: { aa: { aaa: 10 } } }, '[a].[aa].[aaa]', false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa2', false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2', false],
  [{ a: { aa: { aaa: 10 } } }, 'a2', false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa.aaaa', false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2.aaa', false],
  [{ a: { aa: { aaa: 10 } } }, 'a2.aa.aaa', false],

  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[0]', true],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[2]', true],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[3]', false],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[]', false],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[+5454]', false],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[].bbb', false],

  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[=3]', true],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.[=99]', false],

  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.[1].id', true],
  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.1.id', true],
  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.[1].data', false],
  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.[1].data.value', false],
  [{ a: [{ id: 10 }, { id: 20, data: {} }] }, 'a.[1].data', true],
  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.[=id=20]', true],
  [{ a: [{ id: 10 }, { id: 20 }] }, 'a.[=id=20].id', true],
];

const checkIsExistsData2 = [
  [{ a: { aa: { aaa: 10 } } }, 'a'.split('.'), true],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa'.split('.'), true],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa'.split('.'), true],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa2'.split('.'), false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2'.split('.'), false],
  [{ a: { aa: { aaa: 10 } } }, 'a2'.split('.'), false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa.aaa.aaaa'.split('.'), false],
  [{ a: { aa: { aaa: 10 } } }, 'a.aa2.aaa'.split('.'), false],
  [{ a: { aa: { aaa: 10 } } }, 'a2.aa.aaa'.split('.'), false],

  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.0'.split('.'), true],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.2'.split('.'), true],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.3'.split('.'), false],
  [{ a: { aa: { aaa: [1,2,3] } } }, 'a.aa.aaa.'.split('.'), false],
];

describe('checkIsExists', () => {
  test.each(checkIsExistsData)('checkIsExists(%j, %s) === %j', (obj, path, expected) => {
    const result = checkIsExists(obj, path);
    expect(result).toEqual(expected);
  });

  test.each(checkIsExistsData2)('checkIsExists(%j, %j) === %j', (obj, path, expected) => {
    const result = checkIsExists(obj, path);
    expect(result).toEqual(expected);
  });
});