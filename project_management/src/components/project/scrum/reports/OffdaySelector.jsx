import React, { useState } from "react";
const OffdaySelector = ({
  selectedOffDays,
  setSelectedOffDays,
  handleSubmit,
}) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "No Days",
  ];
  const [selectedDays, setSelectedDays] = useState(selectedOffDays);

  const handleDayToggle = (day) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((offDay) => offDay !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedDays);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSelectedOffDays(selectedDays);
    handleSubmit(selectedDays);
  };
  return (
    <div className="off-days-selector">
      <h3>Select Off Days:</h3>
      <form onSubmit={handleFormSubmit}>
        {daysOfWeek.map((day, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
              />
              {day}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default OffdaySelector;
