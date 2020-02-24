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
    id: 998941425,
    title: 'Add useful somthing',
    description: 'I would like to make something interesting and useful'
    steps: [
      { id: 1, text: 'idea', isFinished: false },
      { id: 2, text: 'prepare', isFinished: false },
      { id: 3, text: 'make', isFinished: false }
    ]
  },
  ...
];

...

function findTodo(todoId) {
  return todos.find(el => el.id == todoId);
}

function findStep(todo, stepId) {
  return todos.find(el => el.id == todoId);
}

function changeStepState(todoId, stepId, isFinished) {
  const todoPos = findTodo(todoId);
  const stepPos = findStep(todos[todoPos], stepId);

  return mutate(
    todos,
    { [`[${todoPos}].steps.[${stepPos}].isFinished`]: isFinished }
  );
}

function changeStepText(todoId, stepId, text) {
  const todoPos = findTodo(todoId);
  const stepPos = findStep(todos[todoPos], stepId);

  return mutate(
    todos,
    { [`[${todoPos}].steps.[${stepPos}].text`]: text }
  );
}

function addStep(todoId, text) {
  const todoPos = findTodo(todoId);
  const newStep = { id: Math.floor(Math.random() * 10000), text, isFinished: false };
  return mutate(
    todos,
    { [`[${todoPos}].steps.[]`]: newStep };
  )
}

function removeStep(todoId, stepId) {
  const todoPos = findTodo(todoId);
  const stepPos = findStep(todos[todoPos], stepId);
  return mutate(
    todos,
    { [`[${todoPos}].steps.[${stepPos}].text`]: undefined }
  )
}
```