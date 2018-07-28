# deep-mutatation

## What is it?

It is simple function which get object and list of changes and returns new patched object.

## Installation

```
npm install --save deep-mutation
```

## How it works?

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

const changes = {
    'a': 111,
    'b.b1': 222,
    'b.b2': 'text',
    'c.c1': 20,
    'c.c2': undefined,
    'd.[]': 10,
    'd.[]': 20,
    'e': [1,2,3]
};
const result = mutate(myObject, changes);
```

### Result will be
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

### Changes can be array of arrays

```javascript
// ...

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

// ...
```

## Tests cases

```javascript
mutate([{ a: 10 }, [['a', 5]]); // { a: 5 }];
mutate([{ a: 10 }, [['b', 5]]); // { a: 10, b: 5 }];
mutate([{}, [['a', 10]), ['b', 5]]); // { a: 10, b: 5 }];
mutate([{ a: 10 }, [['a']]); // { }];
mutate([{ a: 10 }, [null]); // { a: 10 }];
mutate([{ a: 10 }, [['a']); // ['b']]); // { }];
mutate([{ a: 10 }, ['a', 'b']); // { }];
mutate([{ a: 10 }, [['a']); // ['b', 5]]); // { b: 5 }];
mutate([{ a: 10 }, [['a', [1,2,3]]]); // { a: [1,2,3] }];
mutate([{ a: 10 }, [['a', { aa: 1 }]]); // { a: { aa: 1 } }];
mutate([{ a: 10 }, [['a', 5], ['b', { bb: 2 }]]); // { a: 5, b: { bb: 2 } }];
// extend object
mutate([{ a: { aa: 10 } }, [['a.aa', 5]]); // { a: { aa: 5 } }];
mutate([{ a: { aa: 10 } }, [['a.aa']]); // { a: { } }];
mutate([{ a: { aa: 10 } }, [['a.aa.[]', 1]]); // { a: { aa: [1] } }];
mutate([{ a: { aa: 10 } }, [['a.aa'], ['a']]); // { }];
mutate([{ a: { aa: 10 } }, ['a.aa', 'a']); // { }];
mutate([{ a: 10 }, [['a.aa', 5]]); // { a: { aa: 5 } }];
mutate([{ a: 10 }, [['a.aa.aaa', 5]]); // { a: { aa: { aaa: 5 } } }];
mutate([{ a: 10 }, [['a.aa.aaa', 5], ['a.aa.aaa.aaaa', 2]]); // { a: { aa: { aaa: { aaaa: 2 } } } }];
mutate([{ a: 10 }, [['a.aa', 5], ['a.aa2', 2]]); // { a: { aa: 5, aa2: 2 } }];
mutate([{ a: 10 }, [['a.aa', 5], ['b.bb', 2]]); // { a: { aa: 5 }, b: { bb: 2 } }];
// extend array
mutate([[], [['[]', 5]]); // [5]];
mutate([{ a: [] }, [['a.[]', 5]]); // { a: [5] }];
mutate([{ a: [] }, [['a.[0]', 5]]); // { a: [5] }];
mutate([{ a: [] }, [['a[0]', 5]]); // { a: [5] }];
mutate([{ a: [] }, [['a[][]', 5]]); // { a: [[5]] }];
mutate([{ a: [] }, [['a.[].[]', 5]]); // { a: [[5]] }];
mutate([{ a: [] }, [['a.[2]', 5]]); // { a: [undefined, undefined, 5] }];
mutate([{ a: [1] }, [['a.[]', 5]]); // { a: [1, 5] }];
mutate([{ a: [1] }, [['a.[]', 5],['a.[]', 7]]); // { a: [1, 5, 7] }];
mutate([{ a: [1] }, [['a.[0]', 5]]); // { a: [5] }];
mutate([{ a: [1] }, [['a.[0]']]); // { a: [] }];
// changes are object
mutate([{ a: [] }, { 'a.[]': 5 }); // { a: [5] }];
mutate([{ a: [] }, { 'a.[0]': 5 }); // { a: [5] }];
mutate([{ a: [] }, { 'a.[2]': 5 }); // { a: [undefined, undefined, 5] }];
mutate([{ a: [1] }, { 'a.[]': 5 }); // { a: [1, 5] }];
mutate([{ a: [1] }, { 'a.[0]': 5 }); // { a: [5] }];
mutate([{ a: { aa: 10 } }, { 'a.aa': 5 }); // { a: { aa: 5 } }];
mutate([{ a: { aa: 10 } }, { 'a.aa': undefined, 'a.aaa': 99 }); // { a: { aaa: 99 } }];
// set object, extend object
mutate([{ a: 10 }, [['a', { aa: 5 }]]); // { a: { aa: 5 } }];
mutate([{ a: 10 }, [['a', { aa: { aaa: 5 } }]]); // { a: { aa: { aaa: 5 } } }];
mutate([{ a: 10 }, [['a', { aa: { aaa: 5 } }], ['a.aa.aaa2', 1]]); // { a: { aa: { aaa: 5, aaa2: 1 } } }];
mutate([{ a: 10 }, [['a', { aa: { aaa: 5, aaa2: 1 } }], ['a.aa.aaa2']]); // { a: { aa: { aaa: 5 } } }];
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

## When can it be used?

### In redux
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

### In component state
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