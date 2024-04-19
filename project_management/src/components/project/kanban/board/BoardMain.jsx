import React, { useContext, useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import "./BoardMain.css";
import Board from "./components/Board/Board";
import Editable from "./components/Editable/Editable";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSession } from "../../../sessioncheck/session";
import { Dropdown } from "bootstrap";
const BoardMain = () => {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [projectName, setProjectName] = useState("");
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [workflow, setWorkFlow] = useState(false);
  var [a, seta] = useState(false);
  const location = useLocation();
  const [filter, setfilter] = useState(false);
  const initializeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setWorkFlow(result.workflow);
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

  const fetchProjectName = async () => {
    console.log(projectId);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`
      );
      const result = await response.json();

      if (result) {
        console.log(result);
        setProjectName(result.projectName);
      } else {
        console.error("Failed to fetch project name");
      }
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };
  const setProjectWorkFlow = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldName: "workflow",
            newValue: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update project. Status: ${response.status}`);
      }

      const updatedProject = await response.json();
      console.log("Project updated successfully:", updatedProject);
      setWorkFlow(true);
      // You can handle the updated project data as needed
    } catch (error) {
      console.error("Error updating project:", error);
      // Handle errors as needed
    }
  };
  useEffect(() => {
    seta(a = true);
    console.log(a)
  }, [location.pathname])
  useEffect(() => {
    console.log("g " + projectId);
    console.log("h " + isInitialized);
    if (!isInitialized || a) {
      initializeData();
      console.log("hek")
      seta(a = false);
    }
    if (projectId && isInitialized) {
      fetchProjectName();
    }
  }, [projectId, isInitialized, a]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  const setName = async (title, bid) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${bid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Board: ${response.statusText}`);
      }
      setData((prevData) => {
        const tempData = [...prevData];
        const index = tempData.findIndex((item) => item.id === bid);
        tempData[index].name = title;
        return tempData;
      });

      // Process successful response here if needed
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
  };

  // const dragCardInBoard = async (prevData, source, destination) => {
  //   if (!destination.droppableId || !source.droppableId) return prevData;

  //   let tempData = [...prevData];

  //   const destinationBoardIdx = tempData.findIndex(
  //     (item) => item.id.toString() === destination.droppableId
  //   );
  //   const sourceBoardIdx = tempData.findIndex(
  //     (item) => item.id.toString() === source.droppableId
  //   );
  //   // try {
  //   //   const response = await fetch(
  //   //     `http://localhost:3010/projects/kanban/${projectId}/cards/reorderCards/${source.droppableId}/${destination.droppableId}/${source.index}/${destination.index}`,
  //   //     {
  //   //       method: "PUT",
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       body: JSON.stringify({
  //   //         sourceIndex: source.index,
  //   //         destinationIndex: destination.index,
  //   //       }),
  //   //     }
  //   //   );

  //   //   if (!response.ok) {
  //   //     throw new Error(`Failed to update Board: ${response.statusText}`);
  //   //   }

  //   //   // Process successful response here if needed
  //   // } catch (error) {
  //   //   console.error("Error updating card item:", error.message);
  //   //   // Handle the error or show a user-friendly message
  //   // }
  //   tempData[destinationBoardIdx].card.splice(
  //     destination.index,
  //     0,
  //     tempData[sourceBoardIdx].card[source.index]
  //   );
  //   tempData[sourceBoardIdx].card.splice(source.index, 1);

  //   return tempData;
  // };
  const dragCardInBoard = (prevData, source, destination) => {
    if (!destination.droppableId || !source.droppableId) return prevData;

    let tempData = [...prevData];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    console.log(tempData[destinationBoardIdx].name);
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };
  const dragCardInSameBoard = async (
    sourceIndex,
    destinationIndex,
    boardId
  ) => {
    const tempData = [...data];
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
      const destinationBoardIdx = tempData.findIndex(
        (item) => item.id.toString() === boardId
      );

      console.log(destinationBoardIdx);

      const [draggedItem] = tempData[destinationBoardIdx].card.splice(
        sourceIndex,
        1
      );
      tempData[destinationBoardIdx].card.splice(
        destinationIndex,
        0,
        draggedItem
      );
      console.log(tempData);
      setData(tempData);
      console.log("abc\n");

      // Process successful response here if needed
    } catch (error) {
      console.error("Error updating card item:", error.message);
      // Handle the error or show a user-friendly message
    }
    console.log(tempData);
    console.log(boardId);
  };

  const addCard = async (value, boardId) => {
    try {
      const user = await checkSession();
      console.log(user);
      if (user.message === "Session Expired") {
        navigate("/login", { state: user });
      }
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/${boardId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cardName: value, ...user }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add card. Server responded with ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      console.log("Card added successfully:", await result.card.creationTime);
      console.log("Card added successfully:", await result.card.board);
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
        `http://localhost:3010/projects/kanban/${projectId}/${targetId}/${cardId}/`,
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

  const addBoard = async (title) => {
    try {
      // Make API call to add a board
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: title }),
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
        `http://localhost:3010/projects/kanban/${projectId}/${bid}`,
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

    // Ask for confirmation


    console.log("Ula");
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}/cards/reorderCards/${source.droppableId}/${destination.droppableId}/${source.index}/${destination.index}`,
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
  const appOuterRef = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      const threshold = 0; // Adjust as needed

      if (e.clientX < threshold) {
        // Scrolling left
        appOuterRef.current.scrollLeft -= 10; // Adjust the scroll amount
      } else if (e.clientX > window.innerWidth - threshold) {
        // Scrolling right
        appOuterRef.current.scrollLeft += 40; // Adjust the scroll amount
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Cleanup the event listener on component unmount
  const onDragUpdate = (update) => {
    const { destination } = update;
    const scrollContainer = scrollContainerRef.current;

    if (destination && scrollContainer) {
      const scrollThreshold = 100; // Adjust the threshold as needed
      const rect = scrollContainer.getBoundingClientRect();

      if (destination.clientX < rect.left + scrollThreshold) {
        // Scrolling left
        scrollContainer.scrollLeft -= 10; // Adjust the scroll amount
        console.log("Scrolling left");
      } else if (destination.clientX > rect.right - scrollThreshold) {
        // Scrolling right
        scrollContainer.scrollLeft += 10; // Adjust the scroll amount
        console.log("Scrolling right");
      }
    }
  };
  // useEffect(() => {
  //   if (isInitialized) {
  //     localStorage.setItem("kanban-board", JSON.stringify(data));
  //   }
  // }, [data, isInitialized]);
  const filterfunction = () => {
    setfilter(!filter);
  }
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <button class="btn btn-primary filter-button" onClick={filterfunction}>
          <img src="/filter_icon.png" alt="Filter Icon" class="filter-icon" style={{ height: '30px', width: '30px' }} />
          {filter ? 'See All Cards' : 'Filter My Cards'}
        </button>
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
          <Droppable
            droppableId="main-board"
            type="BOARD"
            direction="horizontal"
          >
            {(provided) => (
              <div
                className="app_outer"
                ref={(el) => {
                  provided.innerRef(el);
                  scrollContainerRef.current = el;
                }}
                {...provided.droppableProps}
              >
                <div className="app_boards">
                  {data.map((item, index) => (
                    <Board
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      card={item.card}
                      setName={setName}
                      addCard={addCard}
                      removeCard={removeCard}
                      removeBoard={removeBoard}
                      updateCard={updateCard}
                      setProjectWorkFlow={setProjectWorkFlow}
                      workflow={workflow}
                      index={index}
                      length={data.length - 1}
                      filter={filter}
                    />
                  ))}
                  {workflow === false && (
                    <Editable
                      class={"add__board"}
                      name={"Add Board"}
                      btnName={"Add Board"}
                      onSubmit={addBoard}
                      placeholder={"Enter Board  Title"}
                    />
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardMain;
