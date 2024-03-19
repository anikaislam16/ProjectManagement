import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock } from "react-feather";
import { Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
const StartDateButton = ({ due, handleDate, initialDate, value, cardId }) => {
  var [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : null
  );
  const [showModal, setShowModal] = useState(false);
  const [strtdate, setstart] = useState(null);
  const { projectId } = useParams();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const buttonRef = useRef(null);
  //  setSelectedDate(selectedDate = new Date(initialDate));
  console.log(initialDate);
  console.log(selectedDate);
  const handleDateChange = async (date) => {
    setIsDatePickerOpen(false);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        data.boards = data.boards.filter(board => board.completed === false);

        const allCards = data.boards.flatMap((project) => project.cards);
        console.log(allCards)
        const foundCard = allCards.find((card) => card._id === cardId);
        console.log(foundCard);
        if (value === 'creationDate') {

          let stdate = null;
          foundCard.dependencies.forEach((id) => {
            const Card = allCards.find((card) => card._id === id);
            console.log(Card.dueDate)
            if (new Date(Card.dueDate) > new Date(stdate) || stdate === null) {
              stdate = Card.dueDate;
              console.log(stdate);
            }
          });
          if (new Date(date) <= new Date(stdate)) {
            // Set date to stdate + 1 with hours (0,0,0,0)

            const d = new Date(stdate);
            d.setDate(d.getDate() + 1);
            d.setHours(0, 0, 0, 0);
            setstart(new Date(d));
            setShowModal(true);

            // Now, `stdate` has been updated to the next day with hours set to 00:00:00.000
            date = new Date(d);
            console.log(date);
          }
        }
        else {
          console.log('kd');
          const fixingDuration = (currentCard, visited) => {
            console.log(foundCard);
            if (currentCard._id === cardId) {
              currentCard.dueDate = new Date(date)
            }
            // Check if the current card is already visited (indicating a cycle)
            if (visited.includes(currentCard._id)) {
              return false;
            }
            //  console.log('d00');
            // Mark the current card as visited
            visited.push(currentCard._id);

            // Recursively check each dependency
            for (const workflowId of currentCard.workflow || []) {
              var workflowCard = allCards.find((card) => card._id === workflowId);
              console.log(workflowCard, workflowCard.creationDate);
              const boardWithWorkflow = data.boards.find((board) =>
                board.cards.some((card) => card._id === workflowId)
              );
              const workflowboardId = boardWithWorkflow._id;
              console.log(new Date(workflowCard.creationDate) <= new Date(currentCard.dueDate))
              console.log(new Date(workflowCard.creationDate), new Date(currentCard.dueDate))
              if (new Date(workflowCard.creationDate) <= new Date(currentCard.dueDate)) {
                console.log(workflowCard);
                const dayDifference =
                  Math.round((
                    new Date(currentCard.dueDate) - new Date(workflowCard.creationDate)
                  ) /
                    (24 * 60 * 60 * 1000));
                console.log(new Date(currentCard.dueDate), new Date(workflowCard.creationDate))
                console.log(dayDifference);
                var startDate = new Date(currentCard.dueDate);
                startDate.setDate(startDate.getDate() + 1);
                startDate.setHours(0, 0, 0, 0);
                workflowCard.creationDate = startDate;
                var dueDate = new Date(workflowCard.dueDate);
                dueDate.setDate(dueDate.getDate() + dayDifference);
                dueDate.setHours(23, 59, 0, 0);
                console.log(workflowCard)
                workflowCard.dueDate = dueDate;
                console.log(dueDate);
                console.log(workflowCard.creationDate, workflowCard.dueDate);
                console.log('d', workflowCard);
                setStartDueDate(workflowboardId, workflowId, workflowCard.creationDate, workflowCard.dueDate);
              }
              //ekhon dependentCard er sathe current card er compare krbo
              fixingDuration(workflowCard, [...visited]);
            }

            // If not found in the current card or its dependencies, return false
            return false;
          };
          const setStartDueDate = async (workflowboardid, workflowcardid, startDate, dueDate) => {
            const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${workflowboardid}/${workflowcardid}`;
            //  console.log(card);
            try {
              const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fieldName: "creationDate",
                  newValue: startDate,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                console.log(data);
                const response1 = await fetch(
                  `http://localhost:3010/projects/scrum/${projectId}/${workflowboardid}/${workflowcardid}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      fieldName: "dueDate",
                      newValue: dueDate,
                    }),
                  }
                );
                if (response1.ok) {
                  const data1 = await response1.json();
                  console.log(data1);
                }
                // Optionally, you can return the updated data or handle it as needed
              } else {
                console.error("Error updating date:", response.statusText);
                // Handle errors
              }
            } catch (error) {
              console.error("Error updating date:", error.message);
              // Handle errors
            }
          };
          const visited = [];
          fixingDuration(foundCard, visited);
        }
      }
      else {
        console.error("Failed to fetch project data");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    setSelectedDate(date);
    handleDate(value, date.toDateString()); // Convert to the desired format
  };

  const handleButtonClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };
  useEffect(() => {
    if (initialDate === null) {

    }
    setSelectedDate(new Date(initialDate))
  }, [initialDate]);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div style={{ position: "relative" }}>
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ backgroundColor: "#dc2626", color: "white" }}>
            Start Date can not be set before {strtdate.toDateString()} , as it dependent to other Cards.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
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

