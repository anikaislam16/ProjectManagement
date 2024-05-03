import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import SidebarContextScrum from "../../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ChatState } from "../../../kanban/Chatting/context/ChatContextProvider";
export default function DailyScrum() {
  const location = useLocation();
  const { reviewId } = useParams();
  const { pathname } = location;
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const config = useMemo(
    () => ({
      readonly: false,
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,

      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",

        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
    }),
    []
  ); // Pass an empty array as the second argument if there are no dependencies

  // Destructure the context value
  const { open } = useContext(SidebarContextScrum);
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
  const navigate = useNavigate();
  const handleEditorChange = (value) => {
    setContent(value);
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await fetchDailyScrumsByName("_id", reviewId);
      setContent(data[0].content);
      setName(data[0].name);
      console.log(data[0].content);
    };
    fetch();
  }, []);
  const onSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/DailyScrum/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }), // Assuming your backend expects the content in this format
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update daily scrum");
      }

      const updatedScrum = await response.json();
      console.log(updatedScrum);
    } catch (error) {
      console.error("Error updating daily scrum:", error);
      throw error;
    }
  };
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""} `}
      style={{ paddingBottom: "100px" }}
    >
      <div style={{ margin: "10px" }}>
        {name && <h6 style={{ textAlign: "center" }}>Review of {name}</h6>}
        {content && HTMLReactParser(content)}
      </div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={(newContent) => setContent(newContent)}
      />
      <Button style={{ margin: "10px", alignItems: "center" }} onClick={onSave}>
        Update/Add
      </Button>
    </div>
  );
}
