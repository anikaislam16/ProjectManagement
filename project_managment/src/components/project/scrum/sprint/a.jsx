import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import useLocalStorage from "use-local-storage";
import { v4 as uuidv4 } from "uuid";
import "./SprintBoardMain.css";
import SprintBoard from "./Board/SprintBoard";
import SprintEditable from "./Editable/SprintEditable";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import { SkipBack } from "react-feather";
import { checkSession } from "../../../sessioncheck/session";
import { useNavigate } from "react-router-dom";
function SprintBoardMain() {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSprint, setSprint] = useState(0);
  const [backlogId, setBacklogId] = useState("");
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
      const formattedData = result.boards.map((board) => {
        // If you want to return the mapped object, you can do it here
        if (board.boardType === "sprint") {
          setSprint(true);
        }
        return {
          id: board._id, // Adjust based on your response structure
          name: board.name, // Adjust based on your response structure
          card: board.cards, // Assuming cards are an array in your response
          sprintStart: board.sprintStart.split("T")[0],
          sprintEnd: board.sprintEnd.split("T")[0],
          goal: board.goal,
          completed: board.completed,
          boardType: board.boardType,
        };
      });

      setData(formattedData);
      setIsInitialized(true);
      setSprint(formattedData.length);
      console.log(formattedData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  const call = async () => {
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}`
    ); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    setSprint(result.boards.length);
  };
  useEffect(() => {
    call();
  });

  const updateBoard = async (fieldName, title, bid) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${bid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldName: fieldName,
            newValue: title,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Board: ${response.statusText}`);
      }
      setData((prevData) => {
        const tempData = [...prevData];
        const index = tempData.findIndex((item) => item.id === bid);
        tempData[index][fieldName] = title;
        return tempData;
      });

      // Process successful response here if needed
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
  };

  const dragCardInBoard = (prevData, source, destination) => {
    if (!destination.droppableId || !source.droppableId) return prevData;

    let tempData = [...prevData];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };
  const dragCardInSameBoard = (sourceIndex, destinationIndex, boardId) => {
    const tempData = [...data];

    console.log(tempData);
    console.log(boardId);

    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === boardId
    );

    console.log(destinationBoardIdx);

    const [draggedItem] = tempData[destinationBoardIdx].card.splice(
      sourceIndex,
      1
    );
    tempData[destinationBoardIdx].card.splice(destinationIndex, 0, draggedItem);
    console.log(tempData);
    setData(tempData);
    console.log("abc\n");
  };

  const addCard = async (value, boardId) => {
    try {
      const user = await checkSession();
      console.log(user);
      if (user.message === "Session Expired") {
        navigate("/login", { state: user });
      }
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${boardId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardName: value,
            ...user,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add card. Server responded with ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Card added successfully:", result.card);

      // Update state or perform other actions as needed
      setData((prevData) => {
        const tempData = [...prevData];
        const boardIndex = tempData.findIndex((item) => item.id === boardId);

        if (boardIndex !== -1) {
          // Update the board with the new card
          tempData[boardIndex].card.push(result.card);
          console.log(tempData[boardIndex]);
        }

        return tempData;
      });
    } catch (error) {
      console.error("Error adding card:", error.message);
    }
  };

  const removeCard = async (targetId, cardId) => {
    // console.log(targetId, cardId);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${targetId}/${cardId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedData = data.map((board) => {
        if (board.id === targetId) {
          // Remove the card with the matching _id
          board.card = board.card.filter((card) => card._id !== cardId);
          console.log(board.card);
        }
        return board;
      });
      // Update the state with the new data
      setData(updatedData);
      if (!response.ok) {
        throw new Error(`Failed to delete card: ${response.statusText}`);
      }
      // Assuming taskId is part of your state
      // Filter out the deleted task from your state

      console.log("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.message);
      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
    const tempData = [...data];

    // Find the matching board and card
  };
  const saveModalToDb = async (boardId, fieldName, value) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldName: fieldName,
            newValue: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Board: ${response.statusText}`);
      }

      // Process successful response here if needed
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
  };
  const handleSaveChanges = async (boardId, modalData) => {
    // Handle the modal data as needed

    // Close the modal (you might want to handle modal state differently)
    await saveModalToDb(boardId, "sprintStart", modalData.sprintStart);
    await saveModalToDb(boardId, "sprintEnd", modalData.sprintEnd);
    await saveModalToDb(boardId, "goal", modalData.goal);
    setData((prevData) => {
      const updatedData = prevData.map((board) =>
        board.id === boardId
          ? {
              ...board,
              sprintStart: modalData.sprintStart,
              sprintEnd: modalData.sprintEnd,
              goal: modalData.goal,
            }
          : board
      );
      return updatedData;
    });
  };
  const addBoard = async (title) => {
    try {
      // Make API call to add a board
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
            boardType: "sprint",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add board. Server responded with ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Board added successfully:", result);

      // Update state or perform other actions as needed
      setData((prevData) => {
        const tempData = [...prevData];
        tempData.push({
          id: result._id,
          name: result.name,
          card: [],
          sprintStart: result.sprintStart.split("T")[0],
          sprintEnd: result.sprintEnd.split("T")[0],
          goal: result.goal,
          completed: result.completed,
          boardType: result.boardType,
        });
        return tempData;
      });
    } catch (error) {
      console.error("Error adding board:", error.message);
    }
  };

  const removeBoard = async (bid) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${bid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete card: ${response.statusText}`);
      }
      // Assuming taskId is part of your state
      // Filter out the deleted task from your state
      setData((prevData) => {
        const tempData = [...prevData];
        const index = tempData.findIndex((item) => item.id === bid);
        tempData.splice(index, 1);
        return tempData;
      });
      console.log("Board deleted successfully");
    } catch (error) {
      console.error("Error deleting board:", error.message);
      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    console.log("abc " + source.droppableId);
    console.log("bcd " + destination.droppableId);
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    console.log("cde " + sourceIndex);
    console.log("def " + destinationIndex);
    if (source.droppableId === destination.droppableId) {
      dragCardInSameBoard(
        sourceIndex,
        destinationIndex,
        destination.droppableId
      );
      return;
    }
    console.log("Ula");
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/cards/reorderCards/${source.droppableId}/${destination.droppableId}/${source.index}/${destination.index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceIndex: source.index,
            destinationIndex: destination.index,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Board: ${response.statusText}`);
      }

      // Process successful response here if needed
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
    setData((prevData) => dragCardInBoard(prevData, source, destination));
  };

  const updateCard = (bid, cid, card) => {
    setData((prevData) => {
      const tempBoards = [...prevData];
      const index = tempBoards.findIndex((item) => item.id === bid);
      if (index < 0) return prevData;

      const cards = tempBoards[index].card;

      const cardIndex = cards.findIndex((item) => item._id === cid);
      if (cardIndex < 0) return prevData;

      tempBoards[index].card[cardIndex] = card;
      return tempBoards;
    });
  };

  useEffect(() => {
    console.log("h " + isInitialized);
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const completeBoard = async (sourceId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: sourceId,
            dest: backlogId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Board: ${response.statusText}`);
      }
      initializeData();
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
  };
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="BoardMain">
            <div className="app_outer">
              <div className="app_boards">
                {data.map((item) => {
                  // Check if item.completed is false
                  if (!item.completed) {
                    console.log("Current item:", item);

                    return (
                      <SprintBoard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        board={item}
                        card={item.card}
                        updateBoard={updateBoard}
                        addCard={addCard}
                        removeCard={removeCard}
                        removeBoard={removeBoard}
                        updateCard={updateCard}
                        onModalSave={handleSaveChanges}
                        addBoard={addBoard}
                      />
                    );
                  }

                  // If item.completed is true, return null (or any other placeholder)
                  return null;
                })}

                {isSprint < 2 && (
                  <SprintEditable
                    className={"add__board"}
                    name={"Create Sprint"}
                    btnName={"Create"}
                    onSubmit={addBoard}
                    placeholder={"Enter Sprint  Title"}
                    setSprint={setSprint}
                  />
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default SprintBoardMain;
