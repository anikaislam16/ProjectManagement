import React, { useContext, useState } from "react";
import SidebarContext from "../../../../../sidebar_app/components/sidebar_context/SidebarContext";
import SidebarContextScrum from "../../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import MyChats from "./mychats/MyChats";
import { ChatState } from "../context/ChatContextProvider";
import ChatBox from "../chatui/ChatBox";
import { useNavigate, useLocation } from "react-router-dom";
export default function ChatList() {
  const location = useLocation();
  const { pathname } = location;

  // Get context values outside of condition
  const kanbanContext = useContext(SidebarContext);
  const scrumContext = useContext(SidebarContextScrum);

  // Conditionally select the context
  const context = pathname.includes("kanban") ? kanbanContext : scrumContext;

  // Destructure the context value
  const { open } = context;
  const { selectedChat, setSelectedChat, user, setUser } = ChatState();
  // Assuming you're using useParams to get the project ID
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""}`}
      style={{ paddingBottom: "100px", display: "flex" }}
    >
      <div
        style={{
          flex: "24%",
          backgroundColor: "white",
          marginTop: "10px",
          border: "1px solid #ccc",
          marginLeft: "5px", // Add border
          borderRadius: "8px", // Add border radius
          transition: "box-shadow 0.3s", // Add transition for box-shadow
        }}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)")
        } // Add box-shadow on hover
        // Remove box-shadow on mouse leave
      >
        {/* Left side content */}
        <MyChats />
      </div>
      <div
        style={{
          flex: "76%",
          backgroundColor: "white",
          marginLeft: "10px",
          marginRight: "5px",
          marginTop: "10px",
          border: "1px solid #ccc", // Add border
          borderRadius: "8px",
          textAlign: "center", // Add border radius
          // Add transition for box-shadow
        }}
      >
        {selectedChat ? <ChatBox /> : "Click a question to continue"}
      </div>
    </div>
  );
}
