import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Types.css"; // Import your CSS file
import { checkSession } from "../sessioncheck/session.js";
const Types = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
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
        navigate('/login', { state: user });
      }
      //  const time = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:3010/projects/${selectedType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectName: projectName, ...user }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to store project data. Server responded with ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Response:", result);
      const projectId = result._id;
      if (result._id) {
        console.log("Project data stored successfully");
        if (selectedType === "scrum") {
          try {
            const response = await fetch(
              `http://localhost:3010/projects/${selectedType}/${result._id}`,
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
      <div className="type-item" onClick={() => handleTypeItemClick("tdd")}>
        Test Driven Development
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
