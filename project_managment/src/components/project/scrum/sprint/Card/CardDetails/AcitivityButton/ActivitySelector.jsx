// PrioritySelector.js

import React, { useEffect, useState } from "react";
import "./ActivitySelector.css";

const ActivitySelector = ({ initialPriority, setPriority }) => {
  const [selectedPriority, setSelectedPriority] = useState(
    initialPriority || "todo"
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
    setPriority("progres", priority); // Use the updated value in the callback
  };

  const priorityClassName = `priority-selector-${selectedPriority.toLowerCase()}`;

  return (
    <div className={priorityClassName} onClick={handlePriorityClick}>
      {selectedPriority}
      <div className={`options-container ${optionsVisible ? "visible" : ""}`}>
        <div
          className="option option-todo"
          onClick={() => handleOptionClick("todo")}
        >
          todo
        </div>
        <div
          className="option option-progess"
          onClick={() => handleOptionClick("progress")}
        >
          Progress
        </div>
        <div
          className="option option-hold"
          onClick={() => handleOptionClick("hold")}
        >
          Hold
        </div>

        <div
          className="option option-done"
          onClick={() => handleOptionClick("done")}
        >
          Done
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;
