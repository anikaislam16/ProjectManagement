import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./testcases.css";
const TestCases = () => {
  const location = useLocation();
  const navigate = useNavigate();
  var [Card, setCard] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [id, setid] = useState(null);
  const [testupd, setTestupd] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  var [allTest, setAllTest] = useState([]);
  const [filter, setfilter] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const getTest = async (tasks) => {
      let allTestCases = [];
      for (const task of tasks) {
        // Fetch test cases for the current task
        console.log(task._id);
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/test/scrum/${task._id}`
        );
        if (!response.ok) {
          continue;
        }
        const data = await response.json();

        // Add test cases to the array
        allTestCases = [...allTestCases, ...data];
        if (filter === true) {
          // Assuming UserId is the ID you want to filter by
          allTestCases = allTestCases.filter(
            (testCase) => testCase.creator_id === id
          );
        }
      }
      setAllTest((allTest = allTestCases));
      console.log(allTest);
    };
    if (location.state === null) {
      navigate("/unauthorized");
    } else {
      const { card, id } = location.state;
      setCard((Card = card));
      setid(id);
      console.log(Card);
      const tasks = Card.task;
      getTest(tasks);
    }
  }, [location.state, navigate, showModal, showUpdateModal, filter]);
  //console.log(Card.task);
  const handleSave = async () => {
    const testName = document.getElementById("testName").value;
    const selectedValue = document.getElementById("taskName").value;
    const [taskName, taskId] = selectedValue.split(",");
    const preconditions = document.getElementById("preconditions").value;
    const expectedResult = document.getElementById("expectedResult").value;
    const testData = document.getElementById("testData").value;
    console.log(
      testName,
      taskName,
      taskId,
      preconditions,
      expectedResult,
      testData
    );
    setShowModal(false);
    // Check if any field is empty
    if (
      !testName ||
      !taskName ||
      !preconditions ||
      !expectedResult ||
      !testData
    ) {
      // Delay the alert to ensure it appears after the modal disappears
      setTimeout(() => {
        setShowAlertModal(true);
      }, 300);
      return;
    }

    const task_id = taskId; // Assuming taskName is already the task ID
    const task_Name = taskName;
    const test_cases = {
      test_Name: testName,
      pre_conditions: preconditions,
      expected_result: expectedResult,
      test_data: testData,
      creator: id, // Example creator ID
    };
    console.log(test_cases, task_id);

    try {
      const response = await fetch(`${process.env.REACT_APP_HOST}/test/scrum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test_cases, task_id, task_Name }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      const responseData = await response.json();
      console.log("Response data:", responseData);
      // For example, show a success message to the user
      console.log("Test case saved successfully");
    } catch (error) {
      // Handle errors
      console.error("Error:", error.message);
    }
  };
  const handleDelete = async (test_id, task_id) => {
    console.log(test_id, task_id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/test/scrum/${task_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ test_id: test_id }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error("Network response was not ok");
      }
      // If you need to process the response data, you can do it here
      const data = await response.json();
      console.log(data);
      const updatedTestCases = allTest.filter(
        (testCase) => testCase._id !== test_id
      );
      setAllTest(updatedTestCases);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  const handleUpdate = async (item) => {
    console.log(item);
    setTestupd(item);
    setShowUpdateModal(true);
  };
  const handleTestUpdate = async () => {
    console.log(testupd);
    const object = {
      test_Name: testupd.test_Name,
      pre_conditions: testupd.pre_conditions,
      expected_result: testupd.expected_result,
      test_data: testupd.test_data,
      creator: testupd.creator,
      _id: testupd._id,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/test/scrum/${testupd.task_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ test_id: testupd._id, data: object }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error("Network response was not ok");
      }
      // If you need to process the response data, you can do it here
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
    setShowUpdateModal(false);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(id, value);
    setTestupd({ ...testupd, [id]: value });
  };
  const handledetails = async (item) => {
    setTestupd(item);
    setShowDetailModal(true);
  };
  const filterfunction = () => {
    setfilter(!filter);
  };
  return (
    <div>
      <br />
      <h4 style={{ paddingLeft: "30px" }}>{Card.cardName}</h4>
      <button
        class="btn btn-primary filter-button"
        style={{ paddingLeft: "30px", paddingRight: "30px" }}
        onClick={filterfunction}
      >
        <img
          src="/filter_icon.png"
          alt="Filter Icon"
          class="filter-icon"
          style={{ height: "30px", width: "30px" }}
        />
        {filter ? "See All Cards" : "Created by Me"}
      </button>
      <div className="d-flex justify-content-end align-items-center">
        <Button style={{ marginRight: "150px" }} onClick={handleOpenModal}>
          Add a Test
        </Button>
      </div>
      <div></div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <Modal.Title>Add a Test</Modal.Title>
          <form>
            {Card.task && (
              <>
                <div className="mb-3">
                  <label htmlFor="testName" className="form-label">
                    Name:
                  </label>
                  <input type="text" className="form-control" id="testName" />
                </div>
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name:
                  </label>
                  <select className="form-select" id="taskName">
                    {Card.task.map((tasks) => (
                      <option
                        key={tasks._id}
                        value={`${tasks.taskName},${tasks._id}`}
                      >
                        {tasks.taskName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="preconditions" className="form-label">
                    Preconditions:
                  </label>
                  <textarea
                    className="form-control"
                    id="preconditions"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="expectedResult" className="form-label">
                    Expected Result:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="expectedResult"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="testData" className="form-label">
                    Test Data:
                  </label>
                  <textarea className="form-control" id="testData"></textarea>
                </div>
              </>
            )}
          </form>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <br />
      <div className="cont">
        <div className="header">
          <p className="header-item">
            <b> Task Name</b>{" "}
          </p>
          <p className="header-item">
            <b> Test Name</b>{" "}
          </p>
          <p className="header-item">
            <b> Creator</b>{" "}
          </p>
          <p className="header-item">
            <b> Action</b>{" "}
          </p>
        </div>
        {allTest.map((item, index) => (
          <div key={index} className="card">
            <div className="item-details">
              <p className="detail">{item.task_Name}</p>
              <p className="detail">{item.test_Name}</p>
              <p className="detail">{item.creator}</p>
              <div className="action-icons">
                <Button
                  variant="danger"
                  className="icon-button"
                  onClick={() => handleDelete(item._id, item.task_id)}
                >
                  <img src="/delete.png" alt="Delete" className="icon" />
                </Button>
                <Button
                  variant="primary"
                  className="icon-button"
                  onClick={() => handleUpdate(item)}
                >
                  <img src="/update.png" alt="Update" className="icon" />
                </Button>
                <Button
                  variant="secondary"
                  className="icon-button"
                  onClick={() => handledetails(item)}
                >
                  <img src="/detail.png" alt="Details" className="icon" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        show={showAlertModal}
        onHide={() => setShowAlertModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Information Incomplete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please fill in all fields before saving.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlertModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered
      >
        <Modal.Body>
          <Modal.Title>Update Test</Modal.Title>
          <form>
            {testupd && (
              <>
                <div className="mb-3">
                  <label htmlFor="testName" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="test_Name"
                    value={testupd.test_Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name:
                  </label>
                  <select className="form-select" id="task_Name" disabled>
                    <option key={testupd.task_id} value={testupd.task_id}>
                      {testupd.task_Name}
                    </option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="preconditions" className="form-label">
                    Preconditions:
                  </label>
                  <textarea
                    className="form-control"
                    id="pre_conditions"
                    value={testupd.pre_conditions}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="expectedResult" className="form-label">
                    Expected Result:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="expected_result"
                    value={testupd.expected_result}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="testData" className="form-label">
                    Test Data:
                  </label>
                  <textarea
                    className="form-control"
                    id="test_data"
                    value={testupd.test_data}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </>
            )}
          </form>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleTestUpdate}
            >
              Update
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
      >
        <Modal.Body>
          <Modal.Title style={{ textAlign: "center" }}>
            Test Details
          </Modal.Title>
          <div>
            {testupd && (
              <>
                <div className="mb-3">
                  <label
                    htmlFor="testName"
                    className="form-label"
                    style={{ textAlign: "center" }}
                  >
                    <b>Name:</b>
                  </label>
                  <div>{testupd.test_Name}</div>
                </div>
                <br />
                <div className="mb-3">
                  <label
                    htmlFor="taskName"
                    className="form-label"
                    style={{ textAlign: "center" }}
                  >
                    <b>Task Name:</b>
                  </label>
                  <div>{testupd.task_Name}</div>
                </div>
                <br />
                <div className="mb-3">
                  <label
                    htmlFor="expectedResult"
                    className="form-label"
                    style={{ textAlign: "center" }}
                  >
                    <b>Expected Result:</b>
                  </label>
                  <div>{testupd.expected_result}</div>
                </div>
                <br />
                <div className="mb-3">
                  <label
                    htmlFor="testData"
                    className="form-label"
                    style={{ textAlign: "center" }}
                  >
                    <b>Test Data:</b>
                  </label>
                  <div>{testupd.test_data}</div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TestCases;
