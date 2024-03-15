import React, { useEffect, useState, useRef } from "react";
import {
  CheckSquare,
  CreditCard,
  Paperclip,
  Tag,
  Trash,
  User,
  X,
} from "react-feather";
import dependenciesImage from "./dependencies.png";
import { v4 as uuidv4 } from "uuid";
import Editable from "../../Editable/Editable";
import Label from "../../Label/Label";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { useParams } from "react-router-dom";
import StartDateButton from "./Date/StartDateButton";
import PrioritySelector from "./priorityButtons/PrioritySelector";
import EditableHeader from "./tasklist/EditableHeader";
import SprintCardEditable from "../../../../../scrum/sprint/CardEditable/SprintCardEditable";
import CardMember from "./CardMember";
import KanbanEditableHeader from "./tasklist/KanbanEditableHeader";
import Dependencylist from "./Dependency/Dependencylist";
export default function CardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];
  const fileInputRef = useRef(null);
  const { projectId } = useParams();
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [isMemberVisible, setIsMemberVisible] = useState(false);
  const [isdependencyVisible, setIsdependencyVisible] = useState(false);
  const [text, setText] = useState(null);
  const [labelShow, setLabelShow] = useState(false);
  const [pdfFile, setPDFFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfs, setPdf] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log({ ...result.card });
      setValues({ ...result.card });
      setText(result.card.cardName);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const Input = (props) => {
    return (
      <div className="container">
        <div className="title-area">
          <input
            value={text}
            autoFocus
            className="form-control"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              width: "500px",
              borderRadius: "5px",
              // borderColor: "#ccc", // Change border color here
              borderWidth: "0.4px",
            }}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    );
  };

  // const addTask = (value) => {
  //   values.task.push({
  //     id: uuidv4(),
  //     task: value,
  //     completed: false,
  //   });
  //   setValues({ ...values });
  //   console.log(values);
  // };
  const fetchPDFById = async (pdfId) => {
    try {
      const response = await fetch(`http://localhost:3010/pdf/getpdf/${pdfId}`);
      if (response.ok) {
        const result = await response.json();
        console.log("PDF details:", result.pdf);
        // Handle the PDF details as needed

        // Return the result to the caller
        return result.pdf;
      } else {
        console.error("Error fetching PDF details:", response.statusText);
        // Return an object with an error property
        return { error: response.statusText };
      }
    } catch (error) {
      console.error("Error fetching PDF details:", error);
      // Return an object with an error property
      return { error: error.message };
    }
  };
  const handleDownload = async (pdfId, e) => {
    e.preventDefault(); // Prevent the default behavior (e.g., page reload)
    const result = await fetchPDFById(pdfId);
    console.log(result);
    const pdfTitle = result.title;
    const pdfType = result.fieldType;
    console.log(pdfTitle, pdfType);
    try {
      const response = await fetch(
        `http://localhost:3010/pdf/download-pdf/${pdfId}`,
        {
          method: "GET",
        }
      );
      console.log(response);

      if (response.ok) {
        // Trigger download on the client side
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${pdfTitle}.${pdfType}`; // You may customize the filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        console.error("PDF download failed:", error.message);
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("PDF download error:", error);
      // Handle unexpected errors, e.g., show a generic error message
    }
  };
  const fetchAllPDFs = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/pdf/${props.bid}/${props.card._id}/kanban/all-pdfs`
      );
      if (response) {
        const result = await response.json();
        setPdf(result.pdfs);
      } else {
        console.error("Error fetching PDFs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setPDFFile(e.target.files[0]);
    const k = e.target.files[0].name.split(".");

    setTitle(k[0]);
    setDescription("kanban");
  };
  useEffect(() => {
    fetchAllPDFs();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch(
        `http://localhost:3010/pdf/${props.bid}/${props.card._id}/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("PDF uploaded successfully:", result);

        // Reset state variables to null after successful upload
        setPDFFile(null);
        setTitle("");
        setDescription("");

        // Reset the file input value using the ref
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Fetch updated PDFs
        fetchAllPDFs();

        // Handle success, e.g., show a success message to the user
      } else {
        const error = await response.text();
        console.error("PDF upload failed:", error);
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("PDF upload error:", error);
      // Handle unexpected errors, e.g., show a generic error message
    }
  };
  const handleDeleteFile = async (fileId, boardId, cardId, e) => {
    e.preventDefault();
    const description = "kanban";
    try {
      // Make a DELETE request to your backend API
      const response = await fetch(`http://localhost:3010/pdf/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boardId, cardId, description }), // Pass boardId and cardId in the request body
      });

      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        // Handle success (e.g., refresh the UI)
        console.log("File deleted successfully");
        fetchAllPDFs();
      } else {
        // Handle non-successful response
        console.error("Error deleting file:", response.statusText);
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting file:", error);
    }
  };
  const addTask = async (value) => {
    try {
      // Assuming values and setValues are state variables
      // and updateCardItemApi is the API endpoint for updating a card item
      // Prepare the task object without the id

      console.log(props.card);
      console.log(value);
      const name = value[0];
      const point = value[1];
      const pointNum = parseInt(point);
      // Make the API request to update the card item
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldName: "task",
            newValue: {
              taskName: name,
              point: pointNum,
              complete: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update card item: ${response.statusText}`);
      }

      // Parse the JSON from the response, which should contain the new id
      const resultData = await response.json();
      console.log(resultData);
      // Add the id to the new task
      const taskId = resultData.newSubDocumentId; // Replace 'id' with the actual property name in the result

      // Create the complete task object with the id
      const newTask = {
        _id: taskId,
        taskName: name,
        point: pointNum,
        complete: false,
      };

      // Update the state with the new task and result data
      setValues((prevValues) => ({
        ...prevValues,
        task: [...prevValues.task, newTask],
        // Add this line to store the result data in state
      }));
      console.log(values);
    } catch (error) {
      console.error("Error adding task:", error);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };
  const addStartDate = async (startDate, dueDate) => {
    values.startDate = startDate;
    values.dueDate = dueDate;

    setValues({ ...values });
    console.log(values);
  };
  const setPriority = async (priority) => {
    values.priority = priority;
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "priority",
          newValue: priority,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    setValues({ ...values });
  };
  const addDueDate = async (date) => {
    values.dueDate = date;
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "dueDate",
          newValue: date,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();

    setValues({ ...values });
  };
  const removeTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      // Assuming taskId is part of your state
      // Filter out the deleted task from your state
      setValues((prevValues) => ({
        ...prevValues,
        task: prevValues.task.filter((task) => task._id !== id),
      }));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.message);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const handleTaskClick = async (id, updatedValue, updatedPoint) => {
    console.log(updatedPoint);
    const p = parseInt(updatedPoint);
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: updatedValue,
          point: p,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    console.log("fella", resultData);
    setValues((prevValues) => {
      if (prevValues && prevValues.task && Array.isArray(prevValues.task)) {
        const updatedTasks = prevValues.task.map((task) =>
          task._id === id ? { ...task, taskName: updatedValue, point: p } : task
        );
        return {
          ...prevValues,
          task: updatedTasks,
        };
      } else {
        console.error("Invalid values structure:", prevValues);
        // Handle the error or return a default value as needed
        return prevValues;
      }
    });
    console.log(values.task);
  };

  const updateTask = async (id) => {
    const taskIndex = values.task.findIndex((item) => item._id === id);
    values.task[taskIndex].complete = !values.task[taskIndex].complete;
    const Iscomplete = values.task[taskIndex].complete;
    console.log(Iscomplete);
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complete: Iscomplete,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    console.log("fella", resultData);
    setValues({ ...values });
  };
  const updateTitle = async (value) => {
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "cardName",
          newValue: value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    setValues({ ...values, cardName: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.complete === true
    ).length;
    const totalPoints = values.task.reduce((acc, tas) => {
      console.log("Current task:", tas); // Log current task
      console.log("Accumulator:", acc); // Log current accumulator value
      console.log("Accumulating:", acc + tas.point); // Log the result of current iteration
      return acc + tas.point; // Accumulate the points
    }, 0);
    const completedPoints = values.task
      .filter((tas) => tas.complete)
      .reduce((acc, tas) => acc + tas.point, 0);
    console.log(totalPoints, completedPoints);
    const p = ((completedPoints / totalPoints) * 100).toFixed(2);
    if (p > 0) return p;
    return 0;
  };

  const removeTag = async (id) => {
    try {
      console.log("tag id ", id);
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}/tags/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      // Assuming taskId is part of your state
      // Filter out the deleted task from your state
      const tempTag = values.tags.filter((item) => item._id !== id);
      setValues({
        ...values,
        tags: tempTag,
      });

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.message);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };
  const deleteCard = async () => {
    //  try {
    //   const response = await fetch(
    //     `http://localhost:3010/projects/kanban/${projectId}/${targetId}/${cardId}/`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   // Update the state with the new data

    //   console.log("Card deleted successfully");
    // } catch (error) {
    //   console.error("Error deleting task:", error.message);
    //   // Handle errors appropriately, for example, show a notification to the user
    //   // You might want to use a state variable to store and display error messages
    // }
    props.onClose(false);
    props.removeCard(props.bid, values._id);
  };
  const updateFields = async (fieldName, value) => {
    let date = new Date(value);
    if (fieldName === "dueDate") {
      date.setHours(23, 59, 0, 0);
      console.log(date);
    }
    values[fieldName] = date;

    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: fieldName,
          newValue: date,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    setValues({ ...values });
  };
  const addTag = async (value, color) => {
    // Make the API request to update the card item
    const response = await fetch(
      `http://localhost:3010/projects/kanban/${projectId}/${props.bid}/${props.cardId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "tags",
          newValue: {
            tagName: value,
            color: color,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update card item: ${response.statusText}`);
    }
    const resultData = await response.json();
    const tagId = resultData.newSubDocumentId;
    values.tags.push({
      _id: tagId,
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);

      updateTitle(text === "" ? values.cardName : text);
    } else return;
  };

  useEffect(() => {
    console.log(values);
    if (props.updateCard) props.updateCard(props.bid, values._id, values);
  }, [values]);
  const isUploadDisabled = !pdfFile;
  const MemberButtonClick = () => {
    if (isMemberVisible === false) setIsMemberVisible(true);
    else setIsMemberVisible(false);
  };
  const DependencyButtonClick = () => {
    if (isdependencyVisible === false) setIsdependencyVisible(true);
    else setIsdependencyVisible(false);
  };
  return (
    <Modal onClose={props.onClose}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: "650px", position: "relative" }}
        >
          <div className="row pb-4">
            <div className="col-12">
              <div className="d-flex align-items-center pt-3 gap-2">
                <CreditCard className="icon__md" />
                {input ? (
                  <Input
                    title={values.cardName}
                    onClick={() => alert("Button clicked!")}
                  />
                ) : (
                  <div style={{ maxHeight: "400px", width: "700px" }}>
                    <h5
                      style={{ cursor: "pointer" }}
                      onClick={() => setInput(true)}
                    >
                      {values.cardName}
                    </h5>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <h6 className="text-justify">Label</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                      title={item.tagName} // Add title attribute for tooltip
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 10) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item._id)}
                        style={{ width: "20px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccf" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i> No Labels</i>
                  </span>
                )}
              </div>

              <div className="check__list mt-2">
                <div className="d-flex align-items-end  justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckSquare className="icon__md" />
                    <h6>Check List</h6>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item, index) => (
                      <div
                        className="task__list d-flex align-items-start gap-2"
                        key={item._id}
                      >
                        {console.log(item)} {/* Log item to console */}
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.complete}
                          onChange={() => {
                            updateTask(item._id);
                          }}
                        />
                        <EditableHeader
                          value={item}
                          id={item._id}
                          initialValue={item.taskName}
                          initialPoint={item.point}
                          onSave={handleTaskClick}
                          onClose={() => {}}
                        />
                        <Trash
                          onClick={() => {
                            removeTask(item._id);
                          }}
                          style={{
                            cursor: "pointer",
                            width: "18px", // Fix typo in 'width'
                            height: "18px",
                            marginLeft: "30px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <></>
                  )}

                  <SprintCardEditable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
                <h6 className="text-2xl font-semibold mb-4">All PDFs</h6>
                <div className="box-container">
                  {pdfs.map((pdf) => (
                    <div key={pdf._id} className="pdf-box">
                      <div className="pdf-header">
                        <p className="pdf-title">{pdf.title}</p>
                        <button
                          className="delete-button"
                          onClick={(e) =>
                            handleDeleteFile(
                              pdf._id,
                              props.bid,
                              props.card._id,
                              e
                            )
                          }
                          // handleDownload(pdf._id, props.bid, props.card._id, e)
                        >
                          X
                        </button>
                      </div>
                      <button
                        className="bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600"
                        onClick={(e) => handleDownload(pdf._id, e)}
                      >
                        Download
                      </button>
                      {/* Add more details or styling as needed */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-4">
              <h6>Add to card</h6>
              <div className="d-flex card__action__btn flex-column gap-2">
                <button onClick={() => setLabelShow(true)}>
                  <span className="icon__sm">
                    <Tag />
                  </span>
                  Add Label
                </button>
                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                <StartDateButton
                  due="Start"
                  handleDate={updateFields}
                  initialDate={values.startDate}
                  value="startDate"
                  cardId={props.card._id}
                />
                <StartDateButton
                  due="Due"
                  handleDate={updateFields}
                  initialDate={values.dueDate}
                  value="dueDate"
                  cardId={props.card._id}
                />
                <PrioritySelector
                  initialPriority={values.priority}
                  setPriority={updateFields}
                />
                <button onClick={MemberButtonClick}>
                  <span className="icon__sm">
                    {/* Assuming User is an icon component */}
                    <User />
                  </span>
                  Members
                </button>

                {isMemberVisible && (
                  <CardMember bid={props.bid} cardId={props.card._id} />
                )}
                <button onClick={DependencyButtonClick}>
                  <span>
                    {/* Assuming User is an icon component */}
                    <img
                      src={dependenciesImage}
                      alt="Dependencies"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </span>
                  Dependencies
                </button>
                {isdependencyVisible && (
                  <Dependencylist
                    bid={props.bid}
                    cardId={props.card._id}
                    projectId={projectId}
                    addStartDate={addStartDate}
                  />
                )}
                <form className="space-y-4">
                  <input
                    type="file"
                    accept=".pdf, .jpg, .jpeg, .png, .gif, .docx .txt"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="border rounded p-2"
                  />

                  <button
                    type="submit"
                    style={{ color: "black", marginTop: "5px" }}
                    onClick={handleSubmit}
                    disabled={isUploadDisabled}
                  >
                    Upload
                  </button>
                </form>

                <button onClick={deleteCard}>
                  <span className="icon__sm">
                    <Trash />
                  </span>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
