import Chart from "react-apexcharts";
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../../../sidebar_app/components/sidebar_context/SidebarContext";
import "./GraphScrum.css";
import "./PieChart.css";
function PieChartKanban() {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();

  const [dateRange, setDateRange] = useState([]);
  const [totalDays, setTotalDays] = useState(0);

  const [options, setOption] = useState({
    series: [44, 55, 13, 43, 22],
    chart: {
      width: 380,
      type: "pie",
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const [data, setData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [BoardData, setBoardData] = useState(null);
  const [remainingStoryPoints, setRemainingStoryPoints] = useState(0);
  const [storyPointsPerDay, setStoryPointsPerDay] = useState(0);
  const [burnDownData, setBurnDownData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [secondSelectOption, setSecondSelectOption] = useState(null);
  const [piechartData, setPieChartData] = useState([]);
  const [pieChartCategory, setPieChartCategory] = useState([]);
  const handleSecondSelectChange = async (event) => {
    console.log(event.target.value);
    if (event.target.value === "Select a board") {
      console.log("Select a board");
      setSecondSelectOption(null);
    } else {
      setSecondSelectOption(event.target.value);
      if (selectedBoard === "Project") {
        if (event.target.value === "Priority") {
          const priorityTypes = ["High", "Medium", "low"];
          const priorityCounts = countCardsByPriority(data, priorityTypes);
          setPieChartData(priorityCounts);
          setPieChartCategory(priorityTypes);
          console.log(priorityCounts);
        } else if (event.target.value === "Assignee") {
          const assignedMembers = countMembersAssignedToCards(data);
          const memberNames = [];

          for (const memberId in assignedMembers) {
            if (
              assignedMembers.hasOwnProperty(memberId) &&
              memberId !== "unassignedCards"
            ) {
              try {
                const memberName = await getMemberById(memberId);
                console.log(memberName);
                const member = {
                  id: memberId,
                  name: memberName.name,
                  issues: assignedMembers[memberId].value,
                };
                memberNames.push(member);
              } catch (error) {
                // Handle errors or set a default name
                console.error(
                  `Error fetching name for member with ID ${memberId}:`,
                  error
                );
              }
            }
          }
          const member = {
            id: "unassignedCards",
            name: "Unassigned",
            issues: assignedMembers.unassignedCards,
          };
          memberNames.push(member);
          console.log(assignedMembers.unassignedCards);
          const memberNamesArray = memberNames.map((member) => {
            return member.name;
          });
          const memberIssuesArray = memberNames.map((member) => {
            return member.issues;
          });
          setPieChartCategory(memberNamesArray);
          setPieChartData(memberIssuesArray);
        } else if (event.target.value === "Sprint") {
          const BoardArray = data.map((board) => {
            return board.name;
          });
          const BoardData = data.map((board) => {
            return board.card.length;
          });
          setPieChartCategory(BoardArray);
          setPieChartData(BoardData);
        }
      } else {
        if (event.target.value === "Assignee") {
          const assignedMembers = countMembersAssignedToCardsForBoard(
            data,
            selectedBoard
          );
          const memberNames = [];

          for (const memberId in assignedMembers) {
            if (
              assignedMembers.hasOwnProperty(memberId) &&
              memberId !== "unassignedCards"
            ) {
              try {
                const memberName = await getMemberById(memberId);
                console.log(memberName);
                const member = {
                  id: memberId,

                  name: memberName.name,
                  issues: assignedMembers[memberId].value,
                };
                memberNames.push(member);
              } catch (error) {
                // Handle errors or set a default name
                console.error(
                  `Error fetching name for member with ID ${memberId}:`,
                  error
                );
              }
            }
          }
          const member = {
            id: "unassignedCards",
            name: "Unassigned",
            issues: assignedMembers.unassignedCards,
          };
          memberNames.push(member);
          console.log(assignedMembers.unassignedCards);
          const memberNamesArray = memberNames.map((member) => {
            return member.name;
          });
          const memberIssuesArray = memberNames.map((member) => {
            return member.issues;
          });
          setPieChartCategory(memberNamesArray);
          setPieChartData(memberIssuesArray);
        } else if (event.target.value === "Priority") {
          const priorityTypes = ["High", "Medium", "low"];
          const countsForPriority = countCardsByPriorityForBoard(
            data,
            selectedBoard,
            priorityTypes
          );
          setPieChartCategory(priorityTypes);
          setPieChartData(countsForPriority);
          console.log(countsForPriority);
        }
      }
    }
    console.log(selectedBoard);
    // Do something with the selected option if needed
  };

  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      // Format the data and update the state
      const formattedData = result.boards.map((board) => ({
        id: board._id,
        name: board.name,
        card: board.cards,
      }));

      setData(formattedData);
      console.log(formattedData);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBoardChange = (event) => {
    console.log(selectedBoard);
    if (event.target.value === "Select a board") {
      console.log("Select a board");
      setSelectedBoard(null);
    } else if (event.target.value === "Project") {
      setSelectedBoard(event.target.value);
    } else {
      setSelectedBoard(event.target.value);
      const Board = data.find((board) => board.id === event.target.value);
      setBoardData(Board);
    }
    setSelectedBoard(event.target.value);
    console.log(event.target.value);
    // Do something with the selected board if needed
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
      console.log(data);
    }
  }, [isInitialized]);
  useEffect(() => {
    console.log(selectedBoard);
  }, [selectedBoard]);
  useEffect(() => {
    setSecondSelectOption(""); // Assuming you have a function like setSecondSelectOption to update the state
  }, [selectedBoard]);
  const getMemberById = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:3010/members/${memberId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch member by ID. Status: ${response.status}`
        );
      }

      const member = await response.json();
      return member;
    } catch (error) {
      // Handle errors, e.g., log them or show a user-friendly message
      console.error("Error fetching member by ID:", error);
      throw error;
    }
  };

  function countCardsByPriority(projectData, priorityTypes) {
    // Initialize an object to store counts for each priority type
    const priorityCounts = {};

    // Initialize counts for each priority type to zero
    priorityTypes.forEach((priority) => {
      priorityCounts[priority] = 0;
    });

    // Iterate through each board in the project
    projectData.forEach((board) => {
      // Check if the board has cards
      if (board.card && board.card.length > 0) {
        // Iterate through each card in the board
        board.card.forEach((card) => {
          // Increment the corresponding counter based on the card's priority
          if (priorityCounts.hasOwnProperty(card.priority)) {
            priorityCounts[card.priority]++;
          } else {
            // Handle unknown priority types as needed
            // For example, you could ignore or log them
            console.warn(`Unknown priority type: ${card.priority}`);
          }
        });
      }
    });

    // Return an array of counts in the order of priorityTypes
    const countsArray = priorityTypes.map(
      (priority) => priorityCounts[priority]
    );
    return countsArray;
  }
  function countMembersAssignedToCards(projectData) {
    // Initialize an object to store counts for each member
    const memberCounts = {};
    // Initialize a counter for cards not assigned to any member
    let unassignedCardCount = 0;
    // Iterate through each board in the project
    projectData.forEach((board) => {
      // Check if the board has cards
      if (board.card && board.card.length > 0) {
        // Iterate through each card in the board
        board.card.forEach((card) => {
          // Check if the card has any members assigned
          if (card.members.length === 1) unassignedCardCount++;
          if (card.members && card.members.length > 1) {
            // Iterate through each member assigned to the card
            for (let i = 1; i < card.members.length; i++) {
              const member = card.members[i];
              const memberId = member.member_id.toString(); // Convert ObjectId to string
              // Increment the corresponding counter for the member
              if (memberCounts.hasOwnProperty(memberId)) {
                memberCounts[memberId].value++;
              } else {
                // If member is not in the result object, create an entry
                memberCounts[memberId] = { value: 1 };
                console.log(memberCounts);
              }
            }
          }
        });
      }
    });

    // Include the count of unassigned cards in the result object
    memberCounts.unassignedCards = unassignedCardCount;

    // Return an object with member IDs and their corresponding counts, including unassigned cards count
    return memberCounts;
  }
  function countCardsByPriorityForBoard(projectData, boardId, priorityTypes) {
    // Find the board with the given boardId
    const selectedBoard = projectData.find((board) => board.id === boardId);

    // If the board is not found, return an empty array or handle it as needed
    if (!selectedBoard) {
      console.warn(`Board with ID ${boardId} not found.`);
      return [];
    }

    // Initialize an object to store counts for the selected board and priority types
    const priorityCounts = {};

    // Initialize counts for each priority type to zero
    priorityTypes.forEach((priority) => {
      priorityCounts[priority] = 0;
    });

    // Check if the board has cards
    if (selectedBoard.card && selectedBoard.card.length > 0) {
      // Iterate through each card in the board
      selectedBoard.card.forEach((card) => {
        // Increment the corresponding counter based on the card's priority
        if (priorityCounts.hasOwnProperty(card.priority)) {
          priorityCounts[card.priority]++;
        } else {
          // Handle unknown priority types as needed
          // For example, you could ignore or log them
          console.warn(`Unknown priority type: ${card.priority}`);
        }
      });
    }

    // Return an array of counts in the order of priorityTypes
    const countsArray = priorityTypes.map(
      (priority) => priorityCounts[priority]
    );
    return countsArray;
  }
  function countMembersAssignedToCardsForBoard(projectData, boardId) {
    // Find the board with the given boardId
    const selectedBoard = projectData.find((board) => board.id === boardId);

    // If the board is not found, return an empty object or handle it as needed
    if (!selectedBoard) {
      console.warn(`Board with ID ${boardId} not found.`);
      return {};
    }

    // Initialize an object to store counts for each member within the selected board
    const memberCounts = {};

    // Initialize a counter for cards not assigned to any member within the selected board
    let unassignedCardCount = 0;

    // Check if the selected board has cards
    if (selectedBoard.card && selectedBoard.card.length > 0) {
      // Iterate through each card in the selected board
      selectedBoard.card.forEach((card) => {
        // Check if the card has any members assigned
        if (card.members.length === 1) unassignedCardCount++;
        if (card.members && card.members.length > 1) {
          // Iterate through each member assigned to the card
          for (let i = 1; i < card.members.length; i++) {
            const member = card.members[i];
            const memberId = member.member_id.toString(); // Convert ObjectId to string
            // Increment the corresponding counter for the member within the selected board
            if (memberCounts.hasOwnProperty(memberId)) {
              memberCounts[memberId].value++;
            } else {
              // If member is not in the result object, create an entry
              memberCounts[memberId] = { value: 1 };
            }
          }
        }
      });
    }

    // Include the count of unassigned cards within the selected board in the result object
    memberCounts.unassignedCards = unassignedCardCount;

    // Return an object with member IDs and their corresponding counts for the selected board, including unassigned cards count
    return memberCounts;
  }
  function generateContrastingColors(numColors) {
    const colors = [];

    for (let i = 0; i < numColors; i++) {
      const hue = (i * (360 / numColors)) % 360;
      const saturation = 70; // Adjust as needed
      const lightness = 50; // Adjust as needed

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }

    return colors;
  }

  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""}`}
      style={{ paddingBottom: "70px" }}
    >
      <div className="center-content">
        {isInitialized && (
          <div className="select-container">
            <label className="select-label">Select Board:</label>
            <select
              className="select-box"
              value={selectedBoard}
              onChange={handleBoardChange}
            >
              <option value="">Select a board</option>
              <option value="Project">Overall</option>
              {/* Use an empty string instead of null */}
              {data.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            {/* Second select bar based on the selected board */}
            {selectedBoard && (
              <div className="select-container">
                <label className="select-label">Select Option:</label>
                <select
                  className="select-box"
                  value={secondSelectOption}
                  onChange={handleSecondSelectChange}
                >
                  <option value="">Select an option</option>
                  <option value="Assignee">Assignee</option>
                  <option value="Priority">Priority</option>
                  {selectedBoard === "Project" && (
                    <option value="Sprint">Status</option>
                  )}
                  {/* Add additional options as needed */}
                </select>
              </div>
            )}

            {selectedBoard && secondSelectOption && (
              <div>
                {/* Render details or perform actions related to the selected board */}
                <div className="container-fluid mt-3 mb-3">
                  <Chart
                    type="pie"
                    width={1049}
                    height={450}
                    series={piechartData}
                    options={{
                      title: { text: "Kanban PieChart" },
                      noData: { text: "Empty Data" },
                      colors: generateContrastingColors(
                        pieChartCategory.length + 1
                      ),
                      labels: pieChartCategory,
                    }}
                  ></Chart>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PieChartKanban;
