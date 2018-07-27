# deep-mutatation

## What is it?

It is simple function which get object and list of changes and returns new patched object.

## How it works?

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