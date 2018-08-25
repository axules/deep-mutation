# deep-mutation

## What is it?

It is simple function which get object and list of changes and returns new patched object.

## Installation

```
npm install --save deep-mutation
```

# How it works?

### It will be equal
```javascript
const obj = { a: 10, b: 20, c: { c1: 1, c2: 2, c3: { c31: 31 } }};
const result = {
    ...obj,
    c: {
        ...obj.c,
        c3: {
            ...obj.c3,
            c32: 25
        }
    }
};
// equal with mutate
const resultMutate = mutate(obj, { 'c.c3.c32': 25 });
```
### Simple example
```javascript
import mutate from 'deep-mutation';

const myObject = {
    a: 100,
    b: 200,
    c: {
        c1: 1,
        c2: 2
    },
    d: []
};

const changes = [
    ['a', 111],
    ['b.b1', 222],
    ['b.b2', 'text'],
    ['c.c1', 20],
    ['c.c2'],
    ['d.[]', 10],
    ['d.[]', 20],
    ['e', [1,2,3]]
];

const result = mutate(myObject, changes);
```

#### Result will be
```
{
    a: 111,
    b: {
        b1: 222,
        b2: 'text'
    },
    c: {
        c1: 20
    },
    d: [10,20],
    e: [1,2,3]
}
```

### Changes can be array of arrays or object where each key is path

```javascript
// array of arrays
const changes = [
    ['a', 111],
    ['b.b1', 222],
    ['b.b2', 'text'],
    ['c.c1', 20],
    ['c.c2'],
    ['d.[]', 10],
    ['d.[]', 20],
    ['e', [1,2,3]]
];
```

OR

```javascript
// object
const changes = {
    'a': 111,
    'b.b1': 222,
    'b.b2': 'text',
    'c.c1': 20,
    'c.c2': undefined,
    'd.[+123412]': 10,
    'd.[+544555]': 20,
    'e': [1,2,3]
};
```

If key for array item begins from `+` (\`[+${randomNumber}]\`), then value will be append to end of array.
```javascript
...
    'a.[+123312312]': 100
...
// will be equal
...
    'a.[]': 100
...
```

# Immutable comparison
**Examples**
https://github.com/axules/deep-mutation/tree/master/ImmutableComparison

## Performance comparison
**Sandbox editor**: https://codesandbox.io/s/km3w4jowo5

**Sandbox view**: https://km3w4jowo5.codesandbox.io/

![deep-mutation vs immutable performance](https://raw.githubusercontent.com/axules/deep-mutation/master/ImmutableComparison/performanceResult.png)

## Syntax comparison
**Sandbox editor**: https://codesandbox.io/s/j4wkq2znj5

**Sandbox view**: https://j4wkq2znj5.codesandbox.io/

![deep-mutation vs immutable performance](https://raw.githubusercontent.com/axules/deep-mutation/master/ImmutableComparison/SyntaxComparison.png)

# Tests cases

```javascript
mutate({ a: 10 }, [['a', 5]]); // { a: 5 }
mutate({ a: 10 }, [['b', 5]]); // { a: 10, b: 5 }
mutate({}, [['a', 10]), ['b', 5]]); // { a: 10, b: 5 }
mutate({ a: 10 }, [['a']]); // { }
mutate({ a: 10 }, [null]); // { a: 10 }
mutate({ a: 10 }, [['a']); // ['b']]); // { }
mutate({ a: 10 }, ['a', 'b']); // { }
mutate({ a: 10 }, [['a']); // ['b', 5]]); // { b: 5 }
mutate({ a: 10 }, [['a', [1,2,3]]]); // { a: [1,2,3] }
mutate({ a: 10 }, [['a', { aa: 1 }]]); // { a: { aa: 1 } }
mutate({ a: 10 }, [['a', 5], ['b', { bb: 2 }]]); // { a: 5, b: { bb: 2 } }
// extend object
mutate({ a: { aa: 10 } }, [['a.aa', 5]]); // { a: { aa: 5 } }
mutate({ a: { aa: 10 } }, [['a.aa']]); // { a: { } }
mutate({ a: { aa: { aaa: 10 } } }, [['a.aa'], ['a.aa.aaa']]) // { a: { } }
mutate({ a: { aa: 10 } }, [['a.aa.[]', 1]]); // { a: { aa: [1] } }
mutate({ a: { aa: 10 } }, [['a.aa'], ['a']]); // { }
mutate({ a: { aa: 10 } }, ['a.aa', 'a']); // { }
mutate({ a: 10 }, [['a.aa', 5]]); // { a: { aa: 5 } }
mutate({ a: 10 }, [['a.aa.aaa', 5]]); // { a: { aa: { aaa: 5 } } }
mutate({ a: 10 }, [['a.aa.aaa', 5], ['a.aa.aaa.aaaa', 2]]); // { a: { aa: { aaa: { aaaa: 2 } } } }
mutate({ a: 10 }, [['a.aa', 5], ['a.aa2', 2]]); // { a: { aa: 5, aa2: 2 } }
mutate({ a: 10 }, [['a.aa', 5], ['b.bb', 2]]); // { a: { aa: 5 }, b: { bb: 2 } }
// extend array
mutate([], [['[]', 5]]); // [5]
mutate({ a: [] }, [['a.[]', 5]]); // { a: [5] }
mutate({ a: [] }, [['a.[0]', 5]]); // { a: [5] }
mutate({ a: [] }, [['a[0]', 5]]); // { a: [5] }
mutate({ a: [] }, [['a[][]', 5]]); // { a: [[5]] }
mutate({ a: [] }, [['a.[].[]', 5]]); // { a: [[5]] }
mutate({ a: [] }, [['a.[2]', 5]]); // { a: [undefined, undefined, 5] }
mutate({ a: [1] }, [['a.[]', 5]]); // { a: [1, 5] }
mutate({ a: [1] }, [['a.[]', 5],['a.[]', 7]]); // { a: [1, 5, 7] }
mutate({ a: [1] }, [['a.[0]', 5]]); // { a: [5] }
mutate({ a: [1] }, [['a.[0]']]); // { a: [] }
// changes are object
mutate({ a: [] }, { 'a.[]': 5 }); // { a: [5] }
mutate({ a: [] }, { 'a.[0]': 5 }); // { a: [5] }
mutate({ a: [] }, { 'a.[2]': 5 }); // { a: [undefined, undefined, 5] }
mutate({ a: [1] }, { 'a.[]': 5 }); // { a: [1, 5] }
mutate({ a: [1] }, { 'a.[0]': 5 }); // { a: [5] }
mutate({ a: { aa: 10 } }, { 'a.aa': 5 }); // { a: { aa: 5 } }
mutate({ a: { aa: 10 } }, { 'a.aa': undefined, 'a.aaa': 99 }); // { a: { aaa: 99 } }
mutate({ }, { 'a.aa.aaa': undefined }); // { }
mutate({ }, [['a.aa.aaa']]); // { }
mutate({ a: { 0: 'v0', 1: 'v1' } }, [['a.0']]); // { a: { 1: 'v1' } }
mutate({ a: [1,2,3] }, [['a.[]']]); // { a: [1,2,3] }
mutate({ a: [1,2,3] }, [['a.[0]']]); // { a: [2,3] }
mutate({ a: [1,2,3] }, [['a.0']]); // { a: [undefined, 2,3] }
// set object, extend object
mutate({ }, [['a', { aa: 5 }]]) // { a: { aa: 5 } }
mutate({ a: 10 }, [['a', { aa: 5 }]]); // { a: { aa: 5 } }
mutate({ a: 10 }, [['a', { aa: { aaa: 5 } }]]) // { a: { aa: { aaa: 5 } } }
mutate({ a: 10 }, [['a', { aa: { aaa: 5 } }]]); // { a: { aa: { aaa: 5 } } }
mutate({ a: 10 }, [['a', { aa: { aaa: 5 } }], ['a.aa.aaa2', 1]]); // { a: { aa: { aaa: 5, aaa2: 1 } } }
mutate({ a: 10 }, [['a', { aa: { aaa: 5, aaa2: 1 } }], ['a.aa.aaa2']]); // { a: { aa: { aaa: 5 } } }
mutate({ a: 10 }, [['a', { aa: 5 }], ['a', [1,2,3]]]) // { a: [1,2,3] }
mutate({ a: 10 }, [['a', { aa: 5 }], ['a.aa', 12]]) // { a: { aa: 12 } }
mutate({ b: 20 }, [['a', { aa: 5 }], ['a']]) // { b: 20 }
mutate({ b: 20 }, [['a', { aa: 5 }], ['a.aa']]) // { a: { }, b: 20 }
```
### Complex changes tests
```javascript
mutate({ a: 10, b: [], c: {} }, { a: 50, b: { b1: 10 }, c: [1,2,3] }) 
// { a: 50, b: { b1: 10 }, c: [1,2,3] }

mutate(
    { a: 10, b: [], c: {}, d: { d1: 12 }, e: [9,8,7] }, 
    { 
        a: 50, 
        b: { b1: 10 }, 
        c: [1,2,3], 
        'c.[]': { cc: 22 }, 
        'b.b2': 17, 
        'd.d2': 15, 
        'e.[0]': 1, 
        'e.[]': 3 
    }
)
/*
{ 
    a: 50, 
    b: { b1: 10, b2: 17 }, 
    c: [1,2,3, { cc: 22 }], 
    d: { d1: 12, d2: 15 }, 
    e: [1,8,7,3] 
}
*/

mutate(
    { a: { a1: { a1_1: 22 } }, b: [{ b1: 10 }], c: [{ c1: 1 }] }, 
    { 
        'a.a1.a1_1': 33, 
        'a.a1.a1_2': 9,
        'a.a2': 14,
        'b.[0].b1': 11,
        'b.[]': 15,
        'b.[0].b2': null,
        'c[0].c1': undefined,
        'c[0]': 7
    }
)
/*
{ 
    a: { 
        a1: { a1_1: 33, a1_2: 9 },
        a2: 14
    },
    b: [{ b1: 11, b2: null }, 15], 
    c: [7] 
}
*/

mutate(
    { a: 10, b: 20 }, 
    { 
        a: { a1: 1, a2: 2 }, 
        'a.a3.a3_1': 20, b: [1,2,3,{ b1: 1 }], 
        'b.[]': 11, 
        'b[3].b2.b2_1.b2_1_1': 'b2_1_1 value', 
        'c.[]': 14 
    }
)
/*
{ 
    a: { 
        a1: 1, 
        a2: 2, 
        a3: { a3_1: 20 } 
    }, 
    b: [
        1,2,3,{ 
            b1: 1, 
            b2: { 
                b2_1: { b2_1_1: 'b2_1_1 value' }
            }
        }, 
        11
    ], 
    c: [14] 
}
*/
```

### It returns new object always
```javascript
const obj = { a: 10 };
const result = mutate(obj, []);
expect(result).not.toBe(obj);
```

### Full path of change will be update
```javascript
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
```

# (!!!) Attention! Важно! Achtung!
If you use `Object` (or `Array`) as change and change it in next changes rules, then this `Object` (or `Array`) will be changed.
### Test cases
```javascript
test('should change object value', () => {
    const obj = { b: [] };
    const patchObject = { b1: 1, b2: 2, b3: 3 };
    const changes = [
      ['b', patchObject],
      ['b.b4', 4]
    ];
    const resut = mutate(obj, changes);

    expect(resut.b).toEqual(patchObject);
    expect(resut.b).toBe(patchObject);
    expect(patchObject).toEqual({ b1: 1, b2: 2, b3: 3, b4: 4 });
});

test('should change array value', () => {
    const obj = { b: [5,6] };
    const patchArray = [1,2,3];
    const changes = [
      ['b', patchArray],
      ['b.[]', 4]
    ];
    const resut = mutate(obj, changes);

    expect(resut.b).toEqual(patchArray);
    expect(resut.b).toBe(patchArray);
    expect(patchArray).toEqual([1,2,3,4]);
});
```

# When can it be used?

## In redux
```javascript
import mutate from 'deep-mutation';

export default (state = {}, action) => {
  const { type, payload } = action;
  const { uid } = payload;
  
  switch (type) {
    case 'API_REQUEST':
      return mutate(state, [
        [`${uid}._status`, 'request']
      ]);

    case 'API_REQUEST__OK':
      return mutate(state, [
        [`${uid}._status`, 'success'],
        [`${uid}.result`, payload.body],
      ]);

    case 'API_REQUEST__FAIL':
      return mutate(state, [
        [`${uid}._status`, 'fail'],
        [`${uid}.result`],
        [`${uid}.error`, payload.error]
      ]);

    default:
      return state;
  }
};
// ...
```

## In component state
```javascript
import mutate from 'deep-mutation';

class ExampleComponent extends Component {
    // ...
    onClick = () => this.setState(state =>
        mutate(state, {
            isFetching: true,
            'data.value': 'default',
            'data.key': null,
            validation: null
        })
    );
    // ...
}
```
