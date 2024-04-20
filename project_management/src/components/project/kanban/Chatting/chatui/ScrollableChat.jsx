import ScrollableFeed from "react-scrollable-feed";
import { isSameSenderMargin, isSameUser } from "../Chatlogic.js";
import { ChatState } from "../context/ChatContextProvider";
import "./ScrollableChat.css";
import like from "../../../../../sidebar_app/Images/like.png";
import liked from "../../../../../sidebar_app/Images/liked.png";
import pencil from "../../../../../sidebar_app/Images/pencil.png";
import reply from "../../../../../sidebar_app/Images/reply.png";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ScrollableChat = ({ messages, EditMessage, handleToggleLike }) => {
  const { selectedChat, setSelectedChat, user, setUser, users, setUsers } =
    ChatState();
  const [showModal, setShowModal] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [messageId, setMessageId] = useState("");
  const getNameById = (id) => {
    // Find the user object with the matching id
    const user = users.find((user) => user.userId === id);
    // If user is found, return the name; otherwise, return null or handle it as needed
    return user ? user.name : null;
  };
  // Assuming you have functions for handling like and edit actions
  const handleLike = (message) => {
    // Handle like action
    handleToggleLike(user, message);
  };

  const handleEdit = () => {
    // Handle edit action
  };

  const handleSave = () => {
    // You can handle saving the textValue here
    EditMessage(textValue, messageId);

    handleCloseModal(); // Close the modal after saving
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDisplayCode = (code) => {
    // Escape special characters in the code
    const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Format links while keeping other text unchanged
    const formattedCode = escapedCode.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    );
    return formattedCode;
  };
  return (
    <div style={{ maxHeight: "450px", overflowY: "auto" }}>
      {/* Adjust maxHeight and overflowY as needed */}
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: user === m.sender._id ? "flex-end" : "flex-start",
                marginBottom: "10px", // Adjust margin as needed
              }}
              key={m._id}
            >
              <div
                style={{
                  backgroundColor: `${
                    m.sender._id === user ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "10px",
                  padding: "10px",
                  maxWidth: "600px",
                  marginLeft: "10px",
                  marginTop: "10px",
                  textAlign: "left",
                  alignSelf: user === m.sender._id ? "flex-end" : "flex-start",
                  marginRight: "10px",
                }}
              >
                <span style={{ maxWidth: "100%" }}>
                  {" "}
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: handleDisplayCode(m.content),
                    }}
                  />
                </span>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <img
                    src={like}
                    alt="Like"
                    style={{
                      cursor: "pointer",
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                    title="Upvote"
                    onClick={() => handleLike(m._id)}
                  />
                  <span className="like-number" title="number of upvotes">
                    {m.Likes.length}
                  </span>
                  {user === m.sender._id && (
                    <img
                      src={pencil}
                      alt="Edit"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                        marginRight: "5px",
                      }}
                      onClick={() => {
                        setShowModal(true);
                        setTextValue(m.content);
                        setMessageId(m._id);
                      }}
                      title="Edit message"
                    />
                  )}
                </div>
              </div>
              <div className="light-ash-span">
                Sent by {getNameById(m.sender._id)}
              </div>
            </div>
          ))}
      </ScrollableFeed>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Text area for input */}
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
            className="form-control"
            placeholder="Enter your text here"
          />
        </Modal.Body>
        <Modal.Footer>
          {/* Save button */}
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScrollableChat;
