# Only examples

```javascript
import mutate from 'deep-mutation';

const cat = {
  size: {
    weight: 5,
    height: 20,
  },
  breed: 'siam',
  kitten: [
    'Lian',
    'Semion'
  ],
  sex: 'w'
};

return mutate(cat, {
  'size.height': 22,
  'kitten.[+1]': 'Lukan',
  'kitten.[+2]': 'Munya'
});
```

```javascript
import mutate, { deepPatch } from 'deep-mutation';

const todos = [
  {
    id: '199',
    state: 'new',
    title: 'Add useful somthing',
    description: 'I would like to make something interesting and useful'
    steps: [
      { text: 'idea', state: 'no' },
      { text: 'prepare', state: 'no' },
      { text: 'make', state: 'no' }
    ]
  },
  ...
];

...

function completeSteps(todoId, steps) {
  const n = todos.find(el => el.id == todoId);

  return mutate(
    todos,
    steps.map(i => [`[${n}].steps.[${i}].state`, 'yes'])
  );
}

function updateStep(todo, stepNumber, text) {

  return mutate(
    todo,
    deepPatch({ [`[${stepNumber}]`]: { text } }),
  );
}
```