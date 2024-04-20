import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function ScrumReviewBoard() {
  const location = useLocation();
  const { pathname } = location;
  const [type, setType] = useState("");
  // Get context values outside of condition
  const kanbanContext = useContext(SidebarContext);
  const scrumContext = useContext(SidebarContextScrum);

  // Conditionally select the context
  const context = pathname.includes("kanban") ? kanbanContext : scrumContext;

  // Destructure the context value
  const { open } = context;

  const navigate = useNavigate();
  //   const handleClick = () => {
  //     const newPath = location.pathname.replace("/review", `/dailyscrum`);
  //     navigate(newPath);
  //   };
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleClick = (type) => {
    setType(type);
    setShow(true);
  };
  const onSave = () => {};
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""} `}
      style={{ paddingBottom: "100px" }}
    >
      <div className="center-content">
        <div className="containers">
          <div
            className="child big-bold-text"
            onClick={() => {
              handleClick("daily");
            }}
          >
            Daily Scrum Review
          </div>
          <div
            className="child big-bold-text"
            onClick={() => {
              handleClick("scrum");
            }}
          >
            Sprint Review
          </div>
        </div>
      </div>
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
          {type === "scrum" && (
            <Form>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Select>
                  <option value="daily">Daily</option>
                  <option value="sprint">Sprint</option>
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
    </div>
  );
}
