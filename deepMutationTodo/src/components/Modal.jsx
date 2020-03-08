import React, { PureComponent } from "react";
import "./modal.css";

export default class Modal extends PureComponent {
  render() {
    const { children } = this.props;

    return (
      <div className="modal">
        <div className="modalContent">{children}</div>
      </div>
    );
  }
}
