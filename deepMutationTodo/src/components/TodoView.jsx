import React, { PureComponent } from "react";
import TodoEditor from "./TodoEditor";
import TodoRemovingConfirmation from "./TodoRemovingConfirmation";
import Steps from "./Steps";
import "./todoView.css";

export default class TodoView extends PureComponent {
  state = {
    errors: [],
    isEditing: false,
    isRemoving: false
  };

  onClickEdit = () => this.setState({ isEditing: true });

  onCancelEdit = () => this.setState({ isEditing: false });

  onClickRemove = () => this.setState({ isRemoving: true });

  onCancelRemove = () => this.setState({ isRemoving: false });

  onConfirmEdit = (title, description) => {
    const { save, id } = this.props;
    this.onCancelEdit();
    save(id, title, description);
  };

  onConfirmRemove = (title, description) => {
    const { remove, id } = this.props;
    this.onCancelRemove();
    remove(id);
  };

  onSubmitNewStep = event => {
    event.preventDefault();
    const value = event.target.stepText.value.trim();
    if (!value) return null;
    const { addStep, id } = this.props;
    addStep(id, value);
    event.target.stepText.value = "";
  };

  onChangeStep = idStep => {
    const { toggleStep, id } = this.props;
    toggleStep(id, idStep);
  };

  onRemoveStep = idStep => {
    const { removeStep, id } = this.props;
    removeStep(id, idStep);
  };

  render() {
    const { title, description, steps, id } = this.props;
    const { isEditing, isRemoving } = this.state;

    return (
      <div className="todoView">
        <div className="todoView_title">{title}</div>
        <div className="todoView_description">{description}</div>

        <div className="todoView_controls">
          <button type="button" onClick={this.onClickEdit}>
            Edit
          </button>
          <button type="button" onClick={this.onClickRemove}>
            Remove
          </button>
        </div>

        <Steps
          steps={steps}
          toggleStep={this.onChangeStep}
          removeStep={this.onRemoveStep}
        />

        <form onSubmit={this.onSubmitNewStep}>
          <input type="text" name="stepText" placeholder="Add todo step" />
          <button type="submit">[+]</button>
        </form>

        {isEditing && (
          <TodoEditor
            id={id}
            title={title}
            description={description}
            onConfirm={this.onConfirmEdit}
            onCancel={this.onCancelEdit}
          />
        )}
        {isRemoving && (
          <TodoRemovingConfirmation
            title={title}
            onConfirm={this.onConfirmRemove}
            onCancel={this.onCancelRemove}
          />
        )}
      </div>
    );
  }
}
