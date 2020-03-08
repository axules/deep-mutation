import React, { PureComponent } from "react";
import Modal from "./Modal";
import "./todoEditor.css";

export default class TodoEditor extends PureComponent {
  state = {
    errors: []
  };

  onSubmit = event => {
    event.preventDefault();
    const { target } = event;
    const { onConfirm } = this.props;
    const errors = [];
    const title = target.title.value.trim();
    const description = target.description.value.trim();

    if (!title) errors.push("Title can not be empty");
    if (errors.length > 0) return this.setState({ errors });

    onConfirm(title, description);
  };

  render() {
    const { title, description, id, onCancel } = this.props;
    const { errors } = this.state;

    return (
      <Modal>
        <form onSubmit={this.onSubmit} className="todoEditor">
          <input
            type="text"
            placeholder="Todo's title"
            name="title"
            defaultValue={title}
          />
          <textarea
            placeholder="Todo's description"
            name="description"
            defaultValue={description}
          />
          {errors.length > 0 && (
            <ul className="todoEditor_errors">
              {errors.map(el => (
                <li key="el">{el}</li>
              ))}
            </ul>
          )}
          <div className="todoEditor_controls">
            <button type="submit">{id ? "Save" : "Add new"}</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    );
  }
}
