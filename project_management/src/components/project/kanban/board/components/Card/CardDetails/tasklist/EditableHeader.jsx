import React, { useState, useEffect } from "react";

const EditableHeader = ({ value, id, initialValue, onSave, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);
  useEffect(() => {
    console.log(value, id, initialValue);
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    console.log(value.id);
    if (id) onSave(id, editedValue);
    else if (value.id) onSave(value.id, editedValue);
    else onSave(value._id, editedValue);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleCancelClick = () => {
    setEditedValue(initialValue);
    setIsEditing(false);
    onClose();
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input type="text" value={editedValue} onChange={handleInputChange} />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Close</button>
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
