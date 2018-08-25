import { OrderedMap, List } from 'immutable';
import defaultObject from './defaultObject';

let byImmutable = new OrderedMap(defaultObject)
  .mergeDeep({
    count: 120,
    offset: 10,
    searchText: 'text',
    items: null,
    requestId: Math.floor(Math.random() * 1000000),
    status: {
      isLoading: true,
      isError: false,
      isSuccess: false
    }
  })
  .remove('selectedItem')
  .remove('editedItem')
  .remove('error');

// after response
byImmutable = byImmutable
  .setIn(['status', 'isLoading'], false)
  .setIn(['status', 'isSuccess'], true)
  .set('items', [1, 2, 3, 4, 5]);

// once item is selected
byImmutable = byImmutable.set('selectedItem', OrderedMap({ value: 10, id: 1 }));

// once selected item value is changed
byImmutable = byImmutable.setIn(['selectedItem', 'value'], List([1, 2, 3]));

// add new elements to selected item value
byImmutable = byImmutable.setIn(
  ['selectedItem', 'value'],
  byImmutable.getIn(['selectedItem', 'value']).push(10, 20, 30)
);

export default byImmutable;
