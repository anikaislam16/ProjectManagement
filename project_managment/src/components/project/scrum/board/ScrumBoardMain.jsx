import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import ScrumBoardInitializer from "./ScrumBoardInitializer";
const ScrumBoardMain = () => {
  const { open } = useContext(SidebarContextScrum);
  const { project } = useParams();

  const { projectId } = useParams();
  const [datas, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSprint, setSprint] = useState(0);

  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setSprint(result.boards.length);
      console.log(result.boards[result.boards.length - 1]);
      // Format the data and update the state
      const formattedData = result.boards[result.boards.length - 1];

      setData(formattedData);
      setIsInitialized(true);
      setSprint(formattedData.length);
      console.log(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  return (
    <div>
      <ScrumBoardInitializer />
    </div>
  );
};

export default ScrumBoardMain;
