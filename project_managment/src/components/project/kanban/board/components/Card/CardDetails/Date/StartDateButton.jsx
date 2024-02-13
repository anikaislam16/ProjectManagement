import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock } from "react-feather";

const StartDateButton = ({ due, handleDate, initialDate, value }) => {
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleDate(value, date.toDateString()); // Convert to the desired format
    setIsDatePickerOpen(false);
  };

  const handleButtonClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleButtonClick}
        ref={buttonRef}
        style={{
          width: "285px", // Adjust the width as needed
          border: "none", // Remove the border
          padding: "5px", // Add padding for a better appearance
          textAlign: "left", // Align text to the left
          // Add any other styles as needed
        }}
      >
        <span className="icon__sm">
          <Clock />
        </span>
        {" " + due} Date: {selectedDate ? selectedDate.toDateString() : ""}
      </button>
      {isDatePickerOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          popperPlacement="bottom-start"
          popperModifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
          showPopperArrow={false}
          inline
          withPortal
          portalId="calendar-portal"
          popperContainer={() => document.getElementById("calendar-portal")}
        />
      )}
      <div
        id="calendar-portal"
        style={{ position: "absolute", zIndex: 9999 }}
      />
    </div>
  );
};

export default StartDateButton;
