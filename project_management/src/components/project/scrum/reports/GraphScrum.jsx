import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import Chart from "react-apexcharts";
import "./GraphScrum.css";
const GraphScrum = () => {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalPointsArray, setTotalPointsArray] = useState([]);
  const [storyPointsByBoard, setStoryPointsByBoard] = useState([]);
  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      console.log(result.boards[result.boards.length - 1]);
      // Format the data and update the state
      const formattedData = result.boards
        .filter((board) => board.completed === true)
        .map((board) => {
          // If you want to return the mapped object, you can do it here

          return {
            id: board._id, // Adjust based on your response structure
            name: board.name, // Adjust based on your response structure
            card: board.cards, // Assuming cards are an array in your response
            sprintStart: board.sprintStart.split("T")[0],
            totalPoints: board.totalPoints,
            sprintEnd: board.sprintEnd.split("T")[0],
            goal: board.goal,
            completed: board.completed,
            boardType: board.boardType,
          };
        });

      setData(formattedData);
      setIsInitialized(true);
      console.log(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const calculateStoryPointsByBoard = () => {
    const storyPointsArray = data.map((board) => {
      const doneCards = board.card.filter((card) => card.progres === "done");
      const boardStoryPointsSum = doneCards.reduce(
        (sum, card) => sum + card.storyPoints,
        0
      );
      return boardStoryPointsSum;
    });
    setStoryPointsByBoard(storyPointsArray);
  };
  const extractTotalPoints = () => {
    const totalPoints = data.map((board) => board.totalPoints);
    setTotalPointsArray(totalPoints);
  };
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    } else {
      extractTotalPoints();
      calculateStoryPointsByBoard();
    }
  }, [isInitialized, data]);
  const chartWidth = Math.max(1000, data.length * 100);
  const boardNamesArray = data.map((board) => board.name);
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        {/* <p>Ulaa{projectId}</p>
        <p>Total Points Array: {JSON.stringify(totalPointsArray)}</p>
        <p>Story Points By Board: {JSON.stringify(storyPointsByBoard)}</p> */}
        <div className="container">
          <h3 className="text-center mt-3 mb-3">Scrum Velocity Chart</h3>

          <div
            className="chart-container"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <Chart
              type="bar"
              width={chartWidth} // Set the initial width
              height={500}
              series={[
                {
                  name: "Committed",
                  data: totalPointsArray,
                },
                {
                  name: "Completed",
                  data: storyPointsByBoard,
                },
              ]}
              options={{
                plotOptions: {
                  bar: {
                    barWidth: 30, // Set a fixed width for the bars
                    barCategoryGap: "2px", // Set a fixed space between the bars
                  },
                },
                chart: {
                  toolbar: {
                    show: true,
                  },
                  zoom: {
                    enabled: false,
                  },
                  selection: {
                    enabled: false,
                  },
                },
                title: {
                  text: "Scrum Velocity Chart",
                  style: { fontSize: 30 },
                },

                colors: ["#ff9900", "#3366cc"],
                theme: { mode: "light" },
                xaxis: {
                  tickPlacement: "on",
                  categories: boardNamesArray,
                  title: {
                    text: "Sprints",
                    style: { fontSize: 20 },
                  },
                },
                yaxis: {
                  labels: {
                    formatter: (val) => {
                      return `${val} SP`;
                    },
                    style: { fontSize: "15" },
                  },
                  title: {
                    text: "Story Points",
                    style: { fontSize: 20 },
                  },
                },
                legend: {
                  show: true,
                  position: "right",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphScrum;
