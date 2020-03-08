import React, { PureComponent } from "react";
import Modal from "./Modal";

export default class TodoConfirmation extends PureComponent {
  render() {
    const { title, onConfirm, onCancel } = this.props;

    return (
      <Modal>
        <h4>Do you want remove '{title}'?</h4>
        <div>
          <button type="button" onClick={onConfirm}>
            Remove
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </Modal>
    );
  }
}
