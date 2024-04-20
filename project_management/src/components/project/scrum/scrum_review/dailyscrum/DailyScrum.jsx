import React, { useContext, useEffect, useState, useRef } from "react";
import SidebarContextScrum from "../../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function DailyScrum() {
  const location = useLocation();
  const { pathname } = location;
  const editor = useRef(null);
  const [content, setContent] = useState("");
  // Destructure the context value
  const { open } = useContext(SidebarContextScrum);

  const navigate = useNavigate();

  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""} `}
      style={{ paddingBottom: "100px" }}
    >
      <h1>Welcome to Ageee Dev</h1>
      <div>{HTMLReactParser(content)}</div>
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />
      <Button>Update/Add</Button>
    </div>
  );
}
