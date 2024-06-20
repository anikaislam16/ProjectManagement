import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Gantt1 from "./Gantt1";
import { checkSession } from "../../../sessioncheck/session";
import { checkScrumRole } from "../checkScrumRole";
const GanttInitializer = () => {
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { projectId } = useParams();
  var [role, setrole] = useState(null);
  const navigate = useNavigate();
  const initializeData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/projects/scrum/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      result.boards = result.boards.filter(
        (board) => board.completed === false && board.boardType !== "backlog"
      );
      console.log(result.workflow);
      // Format the data and update the state
      const formattedData = result.boards.map((board) => ({
        id: board._id, // Adjust based on your response structure
        name: board.name, // Adjust based on your response structure
        card: board.cards, // Assuming cards are an array in your response
      }));
      console.log(formattedData);
      setData(formattedData);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getRoles = async () => {
    const userData = await checkSession();
    if (userData.hasOwnProperty("message")) {
      const datasend = { message: "Session Expired" };
      navigate("/login", { state: datasend });
    } else {
      const projectrole = await checkScrumRole(projectId, userData.id);
      setrole((role = projectrole.role));
    }
  };
  useEffect(() => {
    console.log("g " + projectId);
    console.log("h " + isInitialized);
    if (!isInitialized) {
      initializeData();
      getRoles();
    }
  }, [isInitialized]);
  return (
    <div>
      {isInitialized ? <Gantt1 data={data} role={role} /> : <p>Loading...</p>}
    </div>
  );
};

export default GanttInitializer;
