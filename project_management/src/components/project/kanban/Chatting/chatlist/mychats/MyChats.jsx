// MyChats.js
import React, { useEffect, useState } from "react";
import "./MyChats.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ChatState } from "../../context/ChatContextProvider";
import { useLocation } from "react-router-dom";
import { checkSession } from "../../../../../sessioncheck/session";
import { useNavigate } from "react-router-dom";

const MyChats = () => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    users,
    setUsers,
    chatOwner,
  } = ChatState();
  const location = useLocation();
  // Sample chat data
  const [chats, setChats] = useState([]);
  const [projectType, setprojectType] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [titleValue, setTitleValue] = useState("");
  const { projectId, type } = useParams();

  const handleItemClick = (index, chat) => {
    setSelectedItem(index);
    setSelectedChat(chat);
  };
  const [showModal, setShowModal] = useState(false);
  const [textValue, setTextValue] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setTextValue("");
    setTitleValue("");
  };
  const handleShow = () => setShowModal(true);
  const getAllMembers = async () => {
    try {
      const response = await fetch("http://localhost:3010/members"); // Assuming your API endpoint is '/api/members'
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const members = await response.json();
      console.log("Members:", members); // Print members data to the console

      // Create an array to store userId and names
      const userIdsAndNames = members.map((member) => ({
        userId: member._id,
        name: member.name,
      }));
      console.log("User IDs and Names:", userIdsAndNames);

      // Update users state variable
      setUsers(userIdsAndNames);
    } catch (error) {
      console.error("Error fetching members:", error);
      // Handle error here, such as displaying an error message to the user
    }
  };

  const getUser = async () => {
    const user = await checkSession();
    console.log(user);
    if (user.message === "Session Expired") {
      navigate("/login", { state: user });
    }
    setUser(user.id);
  };
  useEffect(() => {
    const isKanbanInPath = location.pathname.includes("kanban");
    const type = isKanbanInPath ? "kanban" : "scrum";
    setprojectType(type);
    getAllMembers();
    getUser();
  }, []);
  const fetchChats = async () => {
    var ChatBody = null;
    var api = null;
    console.log(chatOwner);
    if (chatOwner === "You" || type === "You") {
      api = "http://localhost:3010/message/findChatsForMe";
    } else if ((chatOwner === "others") | (type === "others")) {
      api = "http://localhost:3010/message/findChats";
    }
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupAdminId: user, // Example groupAdminId
          ProjectId: projectId, // Example ProjectId
          projectType: projectType, // Example projectType
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      console.log(user, projectId, projectType);
      const data = await response.json();
      console.log(data);
      setChats(data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchChats();
  }, [user, projectType, projectId]);
  const handleSave = async () => {
    // You can implement your save functionality here
    if (!titleValue || !textValue) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all the fields!",
      });
      return;
    }
    if (titleValue === "Notice" || titleValue === "notice") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Notice/notice not allowed",
      });
      return;
    }
    const usersArray = users.map((user) => user.userId);
    var newQuestion = null;
    if (projectType === "kanban") {
      newQuestion = {
        question: titleValue,
        kanbanProject: projectId,
        users: usersArray,
        groupAdmin: user,
      };
    } else if (projectType === "scrum") {
      newQuestion = {
        question: titleValue,
        scrumProject: projectId,
        users: usersArray,
        groupAdmin: user,
      };
    }
    try {
      const response = await fetch(`http://localhost:3010/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add card. Server responded with ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        try {
          const response = await fetch(
            `http://localhost:3010/message/sendMsg`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sender: user,
                content: textValue,
                question: result._id,
              }),
            }
          );
          if (!response.ok) {
            throw new Error(
              `Failed to add Question. Server responded with ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Error Could not add question:", error.message);
        }
      }
    } catch (error) {
      console.error("Error Could not add question:", error.message);
    }
    setTextValue("");
    setTitleValue("");
    fetchChats();
    handleClose();
  };

  return (
    <div
      style={{ flex: "76%", display: "flex", flexDirection: "column" }}
      className="chat-container"
    >
      <div className="head">My Chats</div>
      {chats &&
        chats.map((chat, index) => (
          <div
            key={index}
            className={`chat-item ${selectedItem === index ? "selected" : ""}`}
            onClick={() => handleItemClick(index, chat)}
          >
            {chat.question}
          </div>
        ))}
      <Button variant="primary" onClick={handleShow}>
        Add Question
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Questions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            required // No need for quotes around "required"
            placeholder="Title of the Question"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <br />
          <Form.Control
            as="textarea"
            required // No need for quotes around "required"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={5}
            placeholder="Enter your question"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyChats;
