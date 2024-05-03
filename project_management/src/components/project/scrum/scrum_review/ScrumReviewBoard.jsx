import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./ScrumReview.css";

import Swal from "sweetalert2";

export default function ScrumReviewBoard() {
  const [projectDate, setProjectDate] = useState();
  const { projectId } = useParams();
  const location = useLocation();
  const [initialized, setInitializeData] = useState(false);
  const { pathname } = location;
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  // Get context values outside of condition
  const kanbanContext = useContext(SidebarContext);
  const scrumContext = useContext(SidebarContextScrum);
  const navigate = useNavigate();
  // Conditionally select the context
  const context = pathname.includes("kanban") ? kanbanContext : scrumContext;

  // Destructure the context value
  const { open } = context;

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSprint, setSelectedSprint] = useState("");
  const handleSelectChange = (event) => {
    console.log(event.target.value);
    if (event.target) {
      setSelectedSprint(event.target.value);
      // Do something with the selected board ID, such as updating state or calling another function
    }
  };

  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      setProjectDate(result.creationTime);
      console.log(result);
      setInitializeData(true);
      // Format the data and update the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const fetchDailyScrumsByName = async (paramType, paramValue) => {
    const url = `http://localhost:3010/projects/scrum/DailyScrum?paramType=${paramType}&paramValue=${paramValue}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch daily scrums");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching daily scrums:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log(initialized);
    if (!initialized) {
      initializeData();
    }
  }, [initialized]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleClick = (type) => {
    setType(type);
    setShow(true);
  };
  const createDailyScrum = async (
    name,
    type,
    scrumDate,
    content,
    projectId
  ) => {
    try {
      const response = await fetch(
        "http://localhost:3010/projects/scrum/DailyScrum",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, type, scrumDate, content, projectId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create daily scrum");
      }

      const createdDailyScrum = await response.json();
      return createdDailyScrum;
    } catch (error) {
      console.error("Error creating daily scrum:", error);
      throw error;
    }
  };
  const onSave = async () => {
    // Convert string to Date object
    if (type === "sprint") {
      console.log(selectedSprint);
      const value = await fetchDailyScrumsByName(
        "name",
        selectedSprint.toString()
      );

      if (value.length === 0) {
        const response = await createDailyScrum(
          selectedSprint.toString(),
          type,
          new Date(),
          "",
          projectId
        );

        navigate(`/project/scrum/${projectId}/dailyscrum/${response._id}`);
        //console.log(response);
      } else {
        navigate(`/project/scrum/${projectId}/dailyscrum/${value[0]._id}`);
        //console.log(value[0]);
      }
    } else if (type === "daily") {
      const dateObject = new Date(projectDate);
      const dateObject1 = new Date(selectedDate);

      if (dateObject1 < dateObject) {
        // Alert using SweetAlert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Selected date cannot be before project date!",
        });
        return; // Exit the function early if selectedDate is before projectDate
      }
      const formattedDate = formatDate(selectedDate);
      console.log(formattedDate);
      console.log(selectedDate);
      const value = await fetchDailyScrumsByName(
        "name",
        formattedDate.toString()
      );
      console.log(formattedDate.toString());
      if (value.length === 0) {
        const response = await createDailyScrum(
          formattedDate.toString(),
          type,
          new Date(),
          "",
          projectId
        );

        navigate(`/project/scrum/${projectId}/dailyscrum/${response._id}`);
        //console.log(response);
      } else {
        navigate(`/project/scrum/${projectId}/dailyscrum/${value[0]._id}`);
        //console.log(value[0]);
      }
    }
  };
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""} `}
      style={{ paddingBottom: "100px" }}
    >
      <div className="center-content">
        <div className="scrum-button-container">
          <h5
            style={{ marginTop: "10px", marginRight: "5px", marginLeft: "5px" }}
          >
            Choose to view summary:
          </h5>
          <div
            className="scrum-button"
            style={{ marginRight: "10px" }}
            onClick={() => {
              handleClick("daily");
            }}
          >
            Daily Scrum Review
          </div>
          <div
            className="scrum-button"
            onClick={() => {
              handleClick("sprint");
            }}
          >
            Sprint Review
          </div>
        </div>
      </div>
      {initialized && show && (
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter Scrum Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {type === "daily" && (
              <Form>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <br />
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </Form.Group>
              </Form>
            )}
            {type === "sprint" && data && (
              <Form>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>

                  <Form.Select onChange={handleSelectChange}>
                    <option value="">Select a board</option>
                    {data.boards
                      .filter((board) => board.boardType !== "backlog")
                      .map((board) => (
                        <option key={board._id} value={board.name}>
                          {board.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary" onClick={onSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
