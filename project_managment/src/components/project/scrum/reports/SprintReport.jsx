import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import "./SprintReport.css";
const SprintReport = () => {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [BoardData, setBoardData] = useState([]);
  const [commpletedIssues, setCompletedIssues] = useState([]);
  const [notCommpletedIssues, setNotCompletedIssues] = useState([]);
  const [removedIssues, setRemovedIssues] = useState([]);

  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
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
        sprintStart: board.sprintStart.split("T")[0],
        totalPoints: board.totalPoints,
        sprintEnd: board.sprintEnd.split("T")[0],
        goal: board.goal,
        completed: board.completed,
        boardType: board.boardType,
        started: board.started,
        notCompleted: board.notCompleted,
        removed: board.removed,
      }));

      setData(formattedData);
      console.log(formattedData);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleBoardChange = (event) => {
    setCompletedIssues([]);
    setNotCompletedIssues([]);
    setRemovedIssues([]);
    if (event.target.value === "") {
      setSelectedBoard(null);
    } else {
      setSelectedBoard(event.target.value);
      const Board = data.find((board) => board.id === event.target.value);
      setBoardData(Board);
    }
    // Do something with the selected board if needed
  };
  useEffect(() => {
    console.log(data);
  }, [data]);
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  useEffect(() => {
    // Check if BoardData is not null and has at least one element
    console.log(BoardData);
    if (BoardData) {
      // Assuming there's only one board in BoardData array
      const board = BoardData;
      // Check if board.card is not null and has at least one element
      if (board && board.card && board.card.length > 0) {
        const doneCards = board.card.filter((card) => card.progres === "done");
        console.log(doneCards);
        setCompletedIssues(doneCards);
      } else {
        console.error("Board data or card data is missing or empty.");
      }

      // Iterate over each notCompleted card_id in the array
      if (BoardData.completed === false) {
        const NotDoneCards = board.card.filter(
          (card) => card.progres !== "done"
        );
        if (NotDoneCards) {
          console.log("ulaa");
          setNotCompletedIssues(NotDoneCards);
        }
      } else if (BoardData.notCompleted && BoardData.completed) {
        const notCommpletedIssueArray = [];
        BoardData.notCompleted.forEach((notCompletedItem) => {
          const cardId = notCompletedItem.card_id;
          console.log(cardId);

          const card = findCardById(cardId);
          if (card) {
            card.prevStatus = notCompletedItem.status;
            card.prevPriority = notCompletedItem.priority;
            notCommpletedIssueArray.push(card);
          }
        });
        if (notCommpletedIssueArray) {
          setNotCompletedIssues(notCommpletedIssueArray);
        }
      }
      const notCommpletedIssueArray = [];
      console.log(BoardData.removed);
      if (BoardData.removed && BoardData.removed.length > 0) {
        BoardData.removed.forEach((notCompletedItem) => {
          const cardId = notCompletedItem.card_id;
          console.log(cardId);

          const card = findCardById(cardId);
          if (card) {
            card.prevStatus = notCompletedItem.status;
            card.prevPriority = notCompletedItem.priority;
            notCommpletedIssueArray.push(card);
          }
        });
        if (notCommpletedIssueArray) {
          setRemovedIssues(notCommpletedIssueArray);
        }
      }
    } else {
      console.error("BoardData is null or empty.");
    }
  }, [BoardData]);

  const findCardById = (id) => {
    // Flatten the array of cards from all boards
    const allCards = data.flatMap((board) => board.card);
    // Find the card with the specified ID
    const foundCard = allCards.find((card) => card._id === id);
    console.log(foundCard);
    return foundCard;
  };
  useEffect(() => {
    console.log(notCommpletedIssues);
  }, [notCommpletedIssues]);

  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""}`}
      style={{ paddingBottom: "100px" }}
    >
      <div className="center-content">
        {isInitialized && (
          <div>
            <label>Select Board:</label>
            <select value={selectedBoard} onChange={handleBoardChange}>
              <option value="">Select a board</option>
              {data
                .filter((board) => board.started === true)
                .map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {isInitialized &&
          selectedBoard &&
          BoardData &&
          commpletedIssues.length > 0 && (
            <div
              className="table-container  my-table"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <h2 className="mb-4">Completed Issues</h2>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Card Name</th>
                    <th scope="col">Progress</th>
                    <th scope="col">Priority</th>
                    <th scope="col">StoryPoints</th>
                    <th scope="col">Finished Date</th>
                  </tr>
                </thead>
                <tbody>
                  {commpletedIssues.map((issue) => (
                    <tr key={issue.cardName}>
                      <td>{issue.cardName}</td>
                      <td>{issue.progres}</td>
                      <td>{issue.priority}</td>
                      <td>{issue.storyPoints}</td>
                      <td>
                        {
                          new Date(issue.dueDate)
                            .toLocaleDateString()
                            .split("T")[0]
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {isInitialized &&
          selectedBoard &&
          BoardData &&
          notCommpletedIssues.length > 0 && (
            <div>
              <h2 className="mb-4">Not Completed Issues</h2>
              <div className="my-table">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Card Name</th>
                      {BoardData.completed && (
                        <>
                          <th scope="col">Prev. Status</th>
                          <th scope="col">Prev. Priority</th>
                        </>
                      )}

                      <th scope="col">Progress</th>
                      <th scope="col">Priority</th>
                      <th scope="col">StoryPoints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notCommpletedIssues.map((issue) => (
                      <tr key={issue.cardName}>
                        <td>{issue.cardName}</td>
                        {BoardData.completed && (
                          <>
                            <td>{issue.prevStatus}</td>
                            <td>{issue.prevPriority}</td>
                          </>
                        )}

                        <td>{issue.progres}</td>
                        <td>{issue.priority}</td>
                        <td>{issue.storyPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        {isInitialized &&
          selectedBoard &&
          BoardData &&
          removedIssues.length > 0 && (
            <div>
              <h2 className="mb-4">Removed Issues From Board</h2>
              <div className="my-table">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Card Name</th>
                      {BoardData.completed && (
                        <>
                          <th scope="col">Prev. Status</th>
                          <th scope="col">Prev. Priority</th>
                        </>
                      )}

                      <th scope="col">Progress</th>
                      <th scope="col">Priority</th>
                      <th scope="col">StoryPoints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {removedIssues.map((issue) => (
                      <tr key={issue.cardName}>
                        <td>{issue.cardName}</td>
                        {BoardData.completed && (
                          <>
                            <td>{issue.prevStatus}</td>
                            <td>{issue.prevPriority}</td>
                          </>
                        )}

                        <td>{issue.progres}</td>
                        <td>{issue.priority}</td>
                        <td>{issue.storyPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SprintReport;
