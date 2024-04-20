import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatContextProvider";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import ScrollableChat from "./ScrollableChat";
import "./ChatBox.css";
import add from "../../../../../sidebar_app/Images/add.png";
import io from "socket.io-client";
import plus from "../../../../../sidebar_app/Images/plus.svg";
var socket;
var selectedChatCompare;
const ChatBox = () => {
  const { selectedChat, setSelectedChat, user, setUser } = ChatState();
  const [showModal, setShowModal] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "http://localhost:3010";
  const [socketConnected, setSocketConnected] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);
  const handleToggleLike = async (memberId, messageId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/message/toggle-like?memberId=${memberId}&messageId=${messageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }
      const data = await response.json();
      console.log(data);
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          if (message._id === messageId) {
            // If the message ID matches, update the Likes array
            return { ...message, Likes: data.Likes };
          } else {
            return message;
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async () => {
    if (textAreaValue === "") {
      // Show SweetAlert if text area is empty
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a message before saving!",
      });
      return; // Prevent further execution of saving process
    }
    // Add your save logic here, for example, sending the textAreaValue to a server
    try {
      // Make a POST request to your backend endpoint
      const response = await fetch("http://localhost:3010/message/sendMsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user,
          content: textAreaValue,
          question: selectedChat._id,
        }),
      });

      // Check if the request was successful
      if (response.ok) {
        const responseData = await response.json();
        console.log("Message sent successfully:", responseData);
        socket.emit("new message", responseData);
        setMessages([...messages, responseData]);
        // Handle success, e.g., show a success message to the user
      } else {
        // Handle errors from the server
        const errorMessage = await response.text();
        console.error("Error sending message:", errorMessage);
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error.message);
      // Handle error, e.g., show an error message to the user
    }
    handleClose();

    setTextAreaValue("");
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      // Make a GET request to your backend endpoint with chatId as a query parameter
      const response = await fetch(
        `http://localhost:3010/message/getmessage?chatId=${selectedChat._id}`
      );

      // Check if the request was successful
      if (response.ok) {
        const messages = await response.json();
        console.log("Messages retrieved successfully:", messages);
        setMessages(messages);
        socket.emit("join chat", selectedChat._id);
      } else {
        // Handle errors from the server
        const errorMessage = await response.text();
        console.error("Error retrieving messages:", errorMessage);
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error.message);
      // Handle error, e.g., show an error message to the user
    }
  };

  const EditMessage = async (newContent, messageId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/message/update-message?messageId=${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newContent }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update message");
      }
      const updatedMessage = await response.json();
      socket.emit("edit message", updatedMessage);
      console.log(updatedMessage);
      const updatedMessageIndex = messages.findIndex(
        (message) => message._id === messageId
      );

      // If the message is found in the messages array, update it
      if (updatedMessageIndex !== -1) {
        // Create a copy of the messages array
        const updatedMessages = [...messages];

        // Update the content of the message at updatedMessageIndex
        updatedMessages[updatedMessageIndex].content = newContent;

        // Update the messages state variable with the updated array
        setMessages(updatedMessages);
      }
      console.log(updatedMessageIndex);
    } catch (error) {
      console.error("Error updating message:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    console.log("dsfs fsdf");
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("hi");
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.question._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        console.log("ehl");
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  useEffect(() => {
    socket.on("message edited", (newMessageRecieved) => {
      console.log("hi");
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.question._id
      ) {
      } else {
        console.log("ehl");
        const updatedMessageIndex = messages.findIndex(
          (message) => message._id === newMessageRecieved._id
        );

        // If the message is found in the messages array, update it
        if (updatedMessageIndex !== -1) {
          // Create a copy of the messages array
          const updatedMessages = [...messages];

          // Update the content of the message at updatedMessageIndex
          updatedMessages[updatedMessageIndex].content =
            newMessageRecieved.content;

          // Update the messages state variable with the updated array
          setMessages(updatedMessages);
        }
      }
    });
  });
  return (
    <div>
      <div className="title">
        <h6>{selectedChat.question}</h6>
      </div>
      <div className="messageBody">
        <ScrollableChat
          messages={messages}
          EditMessage={EditMessage}
          handleToggleLike={handleToggleLike}
        />
      </div>
      <div>
        <div
          style={{
            backgroundImage: `url(${plus})`,
            backgroundSize: "cover",
            marginLeft: "960px",
            width: "30px",
            height: "30px",
          }}
          title="Post Question/ Answer"
          onClick={handleShow}
        ></div>
        <Modal
          show={showModal}
          onHide={handleClose}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Post Question/ Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              style={{ width: "570px", height: "400px" }} // You can adjust width and height as needed
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
            ></textarea>
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
    </div>
  );
};

export default ChatBox;
