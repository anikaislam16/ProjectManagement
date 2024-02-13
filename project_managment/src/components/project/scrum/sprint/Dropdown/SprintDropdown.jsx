// SprintDropdown.js

import React, { useEffect, useState } from "react";
import "./SprintDropdown.css";

const SprintDropdown = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = (action) => {
    props.onClose(); // Close the dropdown when an item is clicked
    // Perform the action based on the clicked item
    if (action === "delete") {
      props.onDeleteBoard();
    } else if (action === "edit") {
      alert("fdd");
      props.onClose();
    } else if (action === "complete") {
      // Handle complete action
    }
  };

  useEffect(() => {
    // Attach a click event listener to the document to close the dropdown when clicking outside
    const handleDocumentClick = (event) => {
      if (!event.target.closest(".dropdownBoard")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className={`dropdownBoard ${isDropdownOpen ? "open" : ""}`}>
      <p onClick={() => handleClick("delete")}>Delete Board</p>
      <p onClick={() => handleClick("edit")}>Edit Sprint</p>
      <p onClick={() => handleClick("complete")}>Complete Sprint</p>
    </div>
  );
};

export default SprintDropdown;
