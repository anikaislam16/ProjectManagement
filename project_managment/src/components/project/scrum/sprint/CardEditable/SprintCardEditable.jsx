import React, { useState } from "react";
import { Plus, X } from "react-feather";
import "../Editable/SprintEditable.css";
const SprintCardEditable = (props) => {
  const [show, setShow] = useState(props?.handler || false);
  const [text, setText] = useState(props.defaultValue || "");
  const [point, setPoint] = useState(0);
  const toggleshow = () => {
    setShow(false);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (text && props.onSubmit) {
      const task = [];
      task.push(text);
      task.push(point.toString());
      props.onSubmit(task);
      setText("");
      setPoint(0);
    }
    setShow(false);
  };

  return (
    <div className={`editable ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit} className="editable-form">
          <div className={`editable__input ${props.class}`}>
            <textarea
              placeholder={props.placeholder}
              autoFocus
              required
              id="edit-textarea"
              className="form-control mb-3"
              onChange={(e) => setText(e.target.value)}
              style={{ marginLeft: "3px", height: "70px" }}
            />
            <input
              placeholder="Enter Point"
              autoFocus
              style={{ marginLeft: "3px" }}
              id="edit-input"
              type="number"
              className="form-control mb-3"
              onChange={(e) => setPoint(e.target.value)}
            />
            <div className="btn__control">
              <button className="btn btn-primary me-2" type="submit">
                {props.btnName || "Add"}
              </button>
              <X
                onClick={() => {
                  setShow(false);
                  toggleshow(false);
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <p
          onClick={() => {
            setShow(true);
          }}
        >
          {props.defaultValue === undefined ? <Plus /> : <></>}
          {props?.name || "Add"}
        </p>
      )}
    </div>
  );
};

export default SprintCardEditable;
