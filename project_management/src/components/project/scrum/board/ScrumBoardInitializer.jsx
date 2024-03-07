import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import "./ScrumBoardInitializer.css";
import ScrumBoard from "./Board/ScrumBoard";
const ScrumBoardInitializer = () => {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const [datas, setDatas] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState([]);
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
      const formattedData = result.boards[result.boards.length - 1];
      if (formattedData.boardType === "sprint") setDatas(formattedData);

      setIsInitialized(true);

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
  useEffect(() => {
    // Check if data is available
    if (datas && datas.cards) {
      // Filter cards based on "progres" and update the state
      const cardsWithIndex = datas.cards.map((card, index) => ({
        ...card,
        index: index,
      }));
      // console.log(cardsWithIndex);
      console.log(cardsWithIndex);
      const todoCards = cardsWithIndex.filter(
        (card) => card.progres === "todo"
      );
      const progressCards = cardsWithIndex.filter(
        (card) => card.progres === "progress"
      );
      const holdCards = cardsWithIndex.filter(
        (card) => card.progres === "hold"
      );
      const doneCards = cardsWithIndex.filter(
        (card) => card.progres === "done"
      );

      setData([
        {
          id: "1",
          name: "To Do",
          card: todoCards,
        },
        {
          id: "2",
          name: "In Progress",
          card: progressCards,
        },
        {
          id: "3",
          name: "On Hold",
          card: holdCards,
        },
        {
          id: "4",
          name: "Done",
          card: doneCards,
        },
      ]);

      // Print boards in the console
      // console.log("Todo:", todoCards);
      // console.log("Progress:", progressCards);
      // console.log("Hold:", holdCards);
      // console.log("Done:", doneCards);
    }
  }, [datas]);
  useEffect(() => {
    console.log(data);
  }, [data]);
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
    //setData(tempData);
    console.log("abc\n");
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
  const updateCardProgress = async (fieldName, value, cardId) => {
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${datas._id}/${cardId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "progres",
          newValue: value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
  };
  const ChangePosition = async (boardId, sourceIndex, destinationIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${boardId}/cards/reorderCards/${sourceIndex}/${destinationIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceIndex: sourceIndex,
            destinationIndex: destinationIndex,
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
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    console.log("abc " + source.droppableId);
    console.log("bcd " + destination.droppableId);
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    console.log("cde " + sourceIndex);
    console.log("def " + destinationIndex);
    const findSourceBoard = data.find(
      (board) => board.id === source.droppableId
    );
    console.log(findSourceBoard);
    const findDestBoard = data.find(
      (board) => board.id === destination.droppableId
    );
    // Ensure that findSourceBoard.card is defined and is an array
    let sourceCard = null;
    let DestCard = null;
    if (
      findSourceBoard &&
      findSourceBoard.card &&
      Array.isArray(findSourceBoard.card)
    ) {
      sourceCard = findSourceBoard.card[sourceIndex];

      if (sourceCard) {
        console.log("Found Source Card:", sourceCard.index);
        // Additional operations with the found source card can be added here
      } else {
        console.log("Card not found at index:", sourceIndex);
      }
    } else {
      console.log(
        "Invalid data structure for findSourceBoard or findSourceBoard.card"
      );
    }
    if (
      findDestBoard &&
      findDestBoard.card &&
      Array.isArray(findDestBoard.card)
    ) {
      DestCard = findDestBoard.card[destinationIndex];

      if (DestCard) {
        console.log("Found Dest Card:", DestCard.index);
        // Additional operations with the found source card can be added here
      } else {
        console.log("Card not found at index:", DestCard);
      }
    } else {
      console.log(
        "Invalid data structure for findSourceBoard or findSourceBoard.card"
      );
    }
    console.log(findDestBoard);
    if (source.droppableId === destination.droppableId) {
      await ChangePosition(datas._id, sourceCard.index, DestCard.index);
    } else {
      if (DestCard) {
        if (sourceCard.index < DestCard.index) {
          await ChangePosition(datas._id, sourceCard.index, DestCard.index - 1);
        } else
          await ChangePosition(datas._id, sourceCard.index, DestCard.index);
      } else {
        if (destinationIndex > 0) {
          DestCard = findDestBoard.card[destinationIndex - 1];
          if (sourceCard.index < DestCard.index) {
            await ChangePosition(datas._id, sourceCard.index, DestCard.index);
          }
        }
      }

      if (destination.droppableId === "1") {
        await updateCardProgress("progres", "todo", sourceCard._id);
      } else if (destination.droppableId === "2") {
        await updateCardProgress("progres", "progress", sourceCard._id);
      } else if (destination.droppableId === "3") {
        await updateCardProgress("progres", "hold", sourceCard._id);
      } else if (destination.droppableId === "4") {
        await updateCardProgress("progres", "done", sourceCard._id);
      }
    }
    initializeData();
  };
  const switchCardsInDb = async (boardId, sourceIndex, destinationIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${boardId}/cards/reorderCards/${sourceIndex}/${destinationIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceIndex: sourceIndex,
            destinationIndex: destinationIndex,
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
  const updateCard = (bid, cid, card) => {
    initializeData();
  };
  const removeCard = async (targetId, cardId) => {
    // console.log(targetId, cardId);
    targetId = datas._id;
    console.log(targetId, cardId);
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
        board.card = board.card.filter((card) => card._id !== cardId);
        return board;
      });
      /// Update the state with the new data
      setData(updatedData);
      console.log(response);
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
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="BoardMain">
            <div className="app_outer">
              <div className="app_boards">
                {data.map((item) => {
                  // Check if item.completed is false
                  if (item) {
                    console.log("Current item:", datas._id);

                    return (
                      <ScrumBoard
                        key={item.id}
                        id={datas._id}
                        bb={item.id}
                        name={item.name}
                        board={item}
                        card={item.card}
                        removeCard={removeCard}
                        updateCard={updateCard}
                      />
                    );
                  }

                  // If item.completed is true, return null (or any other placeholder)
                  return null;
                })}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ScrumBoardInitializer;
