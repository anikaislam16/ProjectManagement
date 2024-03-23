import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Gantt1 from "./Gantt1";

const GanttInitializer = () => {
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { projectId } = useParams();
  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      result.boards = result.boards.filter(board => board.completed === false && board.boardType !== 'backlog');
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
  useEffect(() => {
    console.log("g " + projectId);
    console.log("h " + isInitialized);
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  return (
    <div>{isInitialized ? <Gantt1 data={data} /> : <p>Loading...</p>}</div>
  );
};

export default GanttInitializer;
