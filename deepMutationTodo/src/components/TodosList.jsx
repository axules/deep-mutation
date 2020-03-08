import React, { PureComponent } from "react";
import mutate from "deep-mutation";
import TodoEditor from "./TodoEditor";
import TodoView from "./TodoView";
import "./todosList.css";

export default class TodosList extends PureComponent {
  state = {
    todos: [],
    isAdding: false
  };

  randomId() {
    return Math.floor(Math.random() * 1000000);
  }

  addTodo = (title, description) => {
    const { todos } = this.state;
    this.setState({
      // instead of
      // todos: todos.concat({ id: this.randomId(), title, description, steps: [] })
      // I know, it looks good =)
      todos: mutate(todos, [
        ["[]", { id: this.randomId(), title, description, steps: [] }]
      ]),
      isAdding: false
    });
  };

  saveTodo = (todoId, title, description) => {
    const { todos } = this.state;
    const n = todos.findIndex(el => el.id === todoId);
    if (n < 0) return;
    this.setState({
      // instead of
      // const newTodos = todos.slice(0, n)
      // .concat(
      //   {...todos[n], title, description},
      //   todos.slice(n+1)
      // )
      // it looks not so cool already, and little difficult to read and understend
      todos: mutate(todos, {
        [`[${n}].title`]: title,
        [`[${n}].description`]: description
      })
    });
  };

  removeTodo = todoId => {
    const { todos } = this.state;
    const n = todos.findIndex(el => el.id === todoId);
    if (n < 0) return;
    this.setState({
      // instead of
      // todos: todos.slice(0, n).concat(todos.slice(n+1))
      todos: mutate(todos, {
        [`[${n}]`]: undefined
      })
    });
  };

  addTodoStep = (todoId, text) => {
    const { todos } = this.state;
    const n = todos.findIndex(el => el.id === todoId);
    if (n < 0) return;
    const newStep = { id: this.randomId(), text, done: false };
    this.setState({
      // instead of
      // todos: todos.slice(0, n)
      //   .concat(
      //     {...todos[n], steps: todos[n].steps.concat(newStep)},
      //     todos.slice(n+1)
      //   )
      todos: mutate(todos, [[`[${n}].steps.[]`, newStep]]),
      isAdding: false
    });
  };

  toggleTodoStep = (todoId, stepId) => {
    const { todos } = this.state;
    const n = todos.findIndex(el => el.id === todoId);
    if (n < 0) return;
    const m = todos[n].steps.findIndex(el => el.id === stepId);
    if (m < 0) return;
    this.setState({
      // instead of
      // todos: todos.slice(0, n)
      //   .concat(
      //     {...todos[n], steps: todos[n].steps.slice(0, m).concat({ ...todos[n].steps[m], done: !todos[n].steps[m].done}, todos[n].steps.slice(m + 1))},
      //     todos.slice(n+1)
      //   )
      // What is easier to do?
      todos: mutate(todos, [
        [`[${n}].steps[${m}].done`, !todos[n].steps[m].done]
      ])
    });
  };

  removeTodoStep = (todoId, stepId) => {
    const { todos } = this.state;
    const n = todos.findIndex(el => el.id === todoId);
    if (n < 0) return;
    const m = todos[n].steps.findIndex(el => el.id === stepId);
    if (m < 0) return;
    this.setState({
      // instead of
      // todos: todos.slice(0, n)
      //   .concat(
      //     {...todos[n], steps: todos[n].steps.slice(0, m).concat(todos[n].steps.slice(m + 1))},
      //     todos.slice(n+1)
      //   )
      todos: mutate(todos, [[`[${n}].steps[${m}]`]])
    });
  };

  onClickAdd = () => this.setState({ isAdding: true });

  onClickCancelAdd = () => this.setState({ isAdding: false });

  render() {
    const { isAdding, todos } = this.state;

    return (
      <div className="todos">
        <div className="todos_controls">
          <button type="button" onClick={this.onClickAdd}>
            + Add Todo List
          </button>
        </div>

        {isAdding && (
          <div className="todos_editor">
            <TodoEditor
              onConfirm={this.addTodo}
              onCancel={this.onClickCancelAdd}
            />
          </div>
        )}

        <div className="todos_list">
          {todos.map(({ id, title, description, steps = [] }) => (
            <TodoView
              key={id}
              id={id}
              title={title}
              description={description}
              steps={steps}
              save={this.saveTodo}
              remove={this.removeTodo}
              addStep={this.addTodoStep}
              toggleStep={this.toggleTodoStep}
              removeStep={this.removeTodoStep}
            />
          ))}
        </div>
      </div>
    );
  }
}
