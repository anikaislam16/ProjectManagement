import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Types.css"; // Import your CSS file
import { checkSession } from "../sessioncheck/session.js";
import { addNoticeBoxToProject } from "../project/kanban/Chatting/Chatlogic.js";
const Types = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [showWeekdays, setShowWeekdays] = useState(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [id, setid] = useState(null);
  const [noticeArray, setNoticeArray] = useState([]);
  useEffect(() => {
    console.log(process.env.REACT_APP_HOST);
  });
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleShowWeekdays = () => {
    setShowWeekdays(!showWeekdays);
  };
  const handleWeekdayChange = (weekday) => {
    const isSelected = selectedWeekdays.includes(weekday);

    if (isSelected) {
      setSelectedWeekdays(selectedWeekdays.filter((day) => day !== weekday));
    } else {
      setSelectedWeekdays([...selectedWeekdays, weekday]);
    }
  };

  const handleInputClick = () => {
    toggleShowWeekdays();
  };

  const getSelectedWeekdaysString = () => {
    return selectedWeekdays.join(", ");
  };

  const handleTypeItemClick = (item) => {
    setShowModal(true);
    setSelectedType(item);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    console.log("fds");
    console.log("Project Name:", projectName);

    try {
      const user = await checkSession();
      console.log(user);
      if (user.message === "Session Expired") {
        navigate("/login", { state: user });
      }
      console.log(process.env.REACT_APP_HOST);
      setNoticeArray((prevArray) => [...prevArray, user.id]);

      //  const time = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/projects/${selectedType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: projectName,
            weekDays: selectedWeekdays,
            ...user,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to store project data. Server responded with ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      const projectId = result._id;
      if (result._id) {
        console.log("Project data stored successfully");
        console.log("Response:", result);

        await addNoticeBoxToProject(
          selectedType,
          projectId,
          projectName + "#" + projectId,
          Array.isArray(user.id) ? user.id : [user.id], // ensures user.id is always an array
          user.id
        );

        if (selectedType === "scrum") {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_HOST}/projects/${selectedType}/${result._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: "Backlog",
                  boardType: "backlog",
                }),
              }
            );

            if (!response.ok) {
              throw new Error(
                `Failed to store backlog data. Server responded with ${response.status} ${response.statusText}`
              );
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        }
        navigate(`/project/${selectedType}/${projectId}`);
      } else {
        console.error("Failed to store project data. Server response:", result);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }

    setShowModal(false);
  };
  return (
    <div className="types-container">
      <div>
        <h1>Choose Your Framework</h1>
      </div>
      <div className="type-item" onClick={() => handleTypeItemClick("scrum")}>
        Scrum
      </div>
      <div className="type-item" onClick={() => handleTypeItemClick("kanban")}>
        Kanban
      </div>

      {/* Input Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Project Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="projectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="weekdays">
              <Form.Label>Choose Weekdays</Form.Label>
              <Form.Control
                type="text"
                placeholder="Click to choose weekdays"
                value={getSelectedWeekdaysString()}
                onClick={handleInputClick}
                readOnly
              />
              {showWeekdays && (
                <div>
                  {weekdays.map((weekday) => (
                    <Form.Check
                      key={weekday}
                      type="checkbox"
                      label={weekday}
                      checked={selectedWeekdays.includes(weekday)}
                      onChange={() => handleWeekdayChange(weekday)}
                    />
                  ))}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSaveChanges(selectedType)}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Types;
