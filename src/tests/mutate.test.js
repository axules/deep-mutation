import mutate from '../index';


describe('mutate', () => {
  test('should except by object', () => {
    const obj = 10;
    const changes = [];
    try {
      mutate(obj, changes);
    } catch (ex) {
      expect(ex.message).toBe('Type of variable shoud be Object or Array');
    }
  });

  test('should except by object as null', () => {
    const obj = null;
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

  test('should update deeply', () => {
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


  describe('like function', () => {
    test('should return function', () => {
      const obj = { a: 100 };
      const result = mutate(obj);

      expect(result instanceof Function).toBe(true);
      expect(result.length).toBe(1);
    });

    test('should do group changes changes', () => {
      const obj = { a: 100 };
      const changes1 = { a: 200 };
      const changes2 = { ['b.[]']: 150, e: 1000 };
      const changes3 = { ['b.[0]']: 300, c: 99, e: undefined };

      const func = mutate(obj);
      func(changes1);
      func(changes2);
      const result = func(changes3);

      expect(result).toEqual({
        a: 200,
        b: [300],
        c: 99
      });
    });
  });
});
