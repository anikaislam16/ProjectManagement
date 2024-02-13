// PrioritySelector.js

import React, { useEffect, useState } from "react";
import "./PrioritySelector.css";

const PrioritySelector = ({ initialPriority, setPriority }) => {
  const [selectedPriority, setSelectedPriority] = useState(
    initialPriority || "low"
  );
  const [optionsVisible, setOptionsVisible] = useState(false);

  // Log initialPriority to the console when it changes
  useEffect(() => {
    console.log("Initial Priority:", initialPriority);
  }, [initialPriority]);

  const handlePriorityClick = () => {
    setOptionsVisible(!optionsVisible);
  };

  const handleOptionClick = (priority) => {
    setSelectedPriority(priority);
    setOptionsVisible(false);
    setPriority("priority", priority); // Use the updated value in the callback
  };

  const priorityClassName = `priority-selector-${selectedPriority.toLowerCase()}`;

  return (
    <div className={priorityClassName} onClick={handlePriorityClick}>
      {selectedPriority}
      <div className={`options-container ${optionsVisible ? "visible" : ""}`}>
        <div
          className="option option-high"
          onClick={() => handleOptionClick("High")}
        >
          High
        </div>
        <div
          className="option option-medium"
          onClick={() => handleOptionClick("Medium")}
        >
          Medium
        </div>
        <div
          className="option option-low"
          onClick={() => handleOptionClick("Low")}
        >
          Low
        </div>
      </div>
    </div>
  );
};

export default PrioritySelector;
