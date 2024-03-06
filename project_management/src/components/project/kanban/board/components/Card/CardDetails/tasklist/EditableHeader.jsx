import React, { useState, useEffect } from "react";
import "./EditableHeader.css";
const EditableHeader = ({
  value,
  id,
  initialValue,
  initialPoint,
  onSave,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);
  const [editedPoint, setEditedPoint] = useState(initialPoint);
  useEffect(() => {
    console.log(value, id, initialValue);
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    console.log(editedPoint);
    console.log(value.id);
    if (id) onSave(id, editedValue, editedPoint);
    else if (value.id) onSave(value.id, editedValue, editedPoint);
    else onSave(value._id, editedValue, editedPoint);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };
  const handleNumberChange = (e) => {
    const n = e.target.value;
    const np = parseInt(n);
    console.log(np + 3);
    setEditedPoint(np);
  };

  const handleCancelClick = () => {
    setEditedValue(initialValue);
    setIsEditing(false);
    onClose();
  };

  return (
    <div>
      {isEditing ? (
        <div className="container">
          <div className="row">
            <div className="col">
              <form className="my-form">
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    id="taskName"
                    value={editedValue}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter task name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="points" className="form-label">
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    value={editedPoint}
                    className="form-control"
                    placeholder="Enter points"
                    onChange={handleNumberChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="btn btn-primary me-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <h6
          className={`flex-grow-1 ${
            value && value.completed === true ? "strike-through" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={handleEditClick}
        >
          {initialValue}
        </h6>
      )}
    </div>
  );
};

export default EditableHeader;
