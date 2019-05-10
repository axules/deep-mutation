import mutate from '../index';

const data = [
  [{ 'a.01': 10 }, [[['a.01'], 5]], { 'a.01': 5 }],
  [{ a: { 'a.1': { 'a.1.1': 99 } } }, [['a:a.1:a.1.1'.split(':'), 5]], { a: { 'a.1': { 'a.1.1': 5 } } }],
  [{ a: { 'a.1': { 'a.1.1': 99 } } }, [['a:a.1:a.1.2'.split(':'), 5]], { a: { 'a.1': { 'a.1.1': 99, 'a.1.2': 5 } } }],
  [{ a: { 'a.1': { 'a.1.1': 99 } } }, [['a-a.1-a.1.1'.split('-')]], { a: { 'a.1': { } } }],
  [{ a: { 'a.1': { 'a.1.1': 99 } } }, [['a-a.1-a.1.2'.split('-')]], { a: { 'a.1': { 'a.1.1': 99 } } }],
];


describe('mutate', () => {
  describe('path as Array', () => {
    test.each(data)('mutate(%j   +   %j)', (obj, changes, expected) => {
      expect(mutate(obj, changes)).toEqual(expected);
    });
  });
});
