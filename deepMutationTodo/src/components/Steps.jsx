import React, { PureComponent } from "react";
import cn from "classnames";
import "./steps.css";

export default class Steps extends PureComponent {
  onChangeStep = ({ target }) => {
    const { toggleStep } = this.props;
    toggleStep(Number(target.dataset.id));
  };

  onRemoveStep = ({ target }) => {
    const { removeStep } = this.props;
    removeStep(Number(target.dataset.id));
  };

  render() {
    const { steps } = this.props;
    if (steps.length === 0) return null;
    return (
      <ul className="steps">
        {steps.map(el => (
          <li key={el.id} className={cn("step", el.done && "m-done")}>
            <label>
              <input
                type="checkbox"
                data-id={el.id}
                checked={el.done}
                onChange={this.onChangeStep}
              />
              {el.text}
            </label>
            <button type="button" data-id={el.id} onClick={this.onRemoveStep}>
              [x]
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
