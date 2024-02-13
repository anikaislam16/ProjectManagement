import React, { useState } from "react";
import EditableHeader from "./EditableHeader";
const HeaderList = ({ headers, onHeaderClick, onAddHeaderClick }) => {
  const [inputValue, setInputValue] = useState("");
  const handleAddHeaderClick = () => {
    onAddHeaderClick(inputValue);
    setInputValue(""); // Clear the input field
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      {headers.map((header) => (
        <EditableHeader
          key={header.id}
          id={header.id}
          initialValue={header.value}
          onSave={onHeaderClick}
          onClose={() => {}} // You can add close functionality if needed
        />
      ))}
    </div>
  );
};
export default HeaderList;
