import mutate from 'deep-mutation';
import defaultObject from './defaultObject';

let byMutate = mutate(defaultObject, {
  count: 120,
  offset: 10,
  searchText: 'text',
  items: null,
  requestId: Math.floor(Math.random() * 1000000),
  status: {
    isLoading: true,
    isError: false,
    isSuccess: false
  },
  selectedItem: undefined,
  editedItem: undefined,
  error: undefined
});

// after response
byMutate = mutate(byMutate, {
  items: [1, 2, 3, 4, 5],
  'status.isLoading': false,
  'status.isSuccess': true
});

// once item is selected
byMutate = mutate(byMutate, { selectedItem: { value: 10, id: 1 } });

// once selected item value is changed
byMutate = mutate(byMutate, { 'selectedItem.value': [1, 2, 3] });

// add new elements to selected item value
byMutate = mutate(byMutate, {
  'selectedItem.value.[+1]': 10,
  'selectedItem.value.[+2]': 20,
  'selectedItem.value.[+3]': 30
});

export default byMutate;
